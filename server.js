const { User, Share, Portfolio, Transaction } = require('./models');

// BUY Route
app.post('/trade/buy', async (req, res) => {
    try {
        const { userId, shareSymbol, quantity } = req.body;

        // Validate share and user
        const share = await Share.findOne({ where: { symbol: shareSymbol } });
        const user = await User.findByPk(userId);

        if (!share || !user) {
            return res.status(400).json({ error: 'Invalid share symbol or user ID' });
        }

        // Create a new transaction
        const transaction = await Transaction.create({
            userId,
            shareId: share.id,
            type: 'BUY',
            quantity,
            price_at_transaction: share.latest_price
        });

        // Update user's portfolio
        let portfolio = await Portfolio.findOne({ where: { userId, shareId: share.id } });
        if (portfolio) {
            portfolio.quantity += quantity;
            await portfolio.save();
        } else {
            await Portfolio.create({
                userId,
                shareId: share.id,
                quantity
            });
        }

        res.json({ message: 'Shares bought successfully', transaction });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

// SELL Route
app.post('/trade/sell', async (req, res) => {
    try {
        const { userId, shareSymbol, quantity } = req.body;

        // Validate share and user
        const share = await Share.findOne({ where: { symbol: shareSymbol } });
        const user = await User.findByPk(userId);

        if (!share || !user) {
            return res.status(400).json({ error: 'Invalid share symbol or user ID' });
        }

        // Check if user has enough shares to sell
        const portfolio = await Portfolio.findOne({ where: { userId, shareId: share.id } });
        if (!portfolio || portfolio.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough shares to sell' });
        }

        // Create a new transaction
        const transaction = await Transaction.create({
            userId,
            shareId: share.id,
            type: 'SELL',
            quantity,
            price_at_transaction: share.latest_price
        });

        // Update user's portfolio
        portfolio.quantity -= quantity;
        if (portfolio.quantity === 0) {
            await portfolio.destroy();
        } else {
            await portfolio.save();
        }

        res.json({ message: 'Shares sold successfully', transaction });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});
