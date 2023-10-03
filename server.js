const { User, Share, Portfolio, Transaction } = require('./models');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

app.use(bodyParser.json());

// Middleware for JWT Authentication
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// User registration
app.post('/register', async (req, res) => {
    console.log(req.body);  // Log the incoming request body
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).send('Error registering user');
    }
});



// User login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(400).send('Invalid username or password');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid username or password');

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// Fetch all available shares
app.get('/shares', async (req, res) => {
    try {
        const shares = await Share.findAll();
        res.json(shares);
    } catch (error) {
        res.status(500).send('Error fetching shares');
    }
});

// Register new share
app.post('/shares', async (req, res) => {
    try {
        const { symbol, latest_price } = req.body;

        // Validate symbol and price
        if (!symbol || symbol.length !== 3 || !/^[A-Z]+$/.test(symbol)) {
            return res.status(400).json({ error: 'Invalid share symbol.' });
        }
        if (!latest_price || !/^\d+\.\d{2}$/.test(latest_price)) {
            return res.status(400).json({ error: 'Price should have exactly two decimal places.' });
        }

        const share = await Share.create({
            symbol,
            latest_price
        });

        res.status(201).json(share);
    } catch (error) {
        // res.status(500).json({ error: 'Error registering share.' });
        res.status(500).json({ error: error.message, stack: error.stack });
        console.error('Error:', error.message);

    }
});

// Update share price
app.put('/shares/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { latest_price } = req.body;

        // Validate price
        if (!latest_price || !/^\d+\.\d{2}$/.test(latest_price)) {
            return res.status(400).json({ error: 'Price should have exactly two decimal places.' });
        }

        const share = await Share.findOne({ where: { symbol } });
        if (!share) {
            return res.status(404).json({ error: 'Share not found.' });
        }

        share.latest_price = latest_price;
        await share.save();

        res.json(share);
    } catch (error) {
        res.status(500).json({ error: 'Error updating share price.' });
    }
});

// Fetch a user's portfolio

app.get('/portfolio/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const portfolio = await Portfolio.findAll({
            where: { userId },
            include: [{ model: Share, as: 'Share' }]  // Use the alias here
        });

        if (!portfolio.length) {
            return res.status(404).json({ error: 'Portfolio not found.' });
        }

        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching portfolio.' });
    }
});

// Fetch a user's transaction history
app.get('/transactions/:userId', authenticateJWT, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ where: { userId: req.params.userId } });
        res.json(transactions);
    } catch (error) {
        res.status(500).send('Error fetching transactions');
    }
});

// BUY route
app.post('/trade/buy', async (req, res) => {
    try {
        const { userId, shareSymbol, quantity } = req.body;

        // Validate input
        if (!userId || !shareSymbol || !quantity) {
            return res.status(400).json({ error: 'Invalid input.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const share = await Share.findOne({ where: { symbol: shareSymbol } });
        if (!share) {
            return res.status(404).json({ error: 'Share not found.' });
        }

        // Create a new transaction
        await Transaction.create({
            userId,
            shareId: share.id,
            type: 'BUY',
            quantity,
            price_at_transaction: share.latest_price
        });

        // Update or create portfolio entry
        let portfolioEntry = await Portfolio.findOne({ where: { userId, shareId: share.id } });
        if (portfolioEntry) {
            portfolioEntry.quantity += quantity;
            await portfolioEntry.save();
        } else {
            await Portfolio.create({
                userId,
                shareId: share.id,
                quantity
            });
        }

        res.status(201).json({ message: 'Shares bought successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error buying shares.' });
    }
});

app.post('/trade/sell', async (req, res) => {
    try {
        const { userId, shareSymbol, quantity } = req.body;

        // Validate input
        if (!userId || !shareSymbol || !quantity) {
            return res.status(400).json({ error: 'Invalid input.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const share = await Share.findOne({ where: { symbol: shareSymbol } });
        if (!share) {
            return res.status(404).json({ error: 'Share not found.' });
        }

        // Check if user has enough shares to sell
        const portfolioEntry = await Portfolio.findOne({ where: { userId, shareId: share.id } });
        if (!portfolioEntry || portfolioEntry.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough shares to sell.' });
        }

        // Create a new transaction
        await Transaction.create({
            userId,
            shareId: share.id,
            type: 'SELL',
            quantity,
            price_at_transaction: share.latest_price
        });

        // Update portfolio entry
        portfolioEntry.quantity -= quantity;
        if (portfolioEntry.quantity === 0) {
            await portfolioEntry.destroy();
        } else {
            await portfolioEntry.save();
        }

        res.json({ message: 'Shares sold successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error selling shares.' });
    }
});

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


