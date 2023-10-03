const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Transaction extends Model {}

Transaction.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    shareId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Shares',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('BUY', 'SELL'),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_at_transaction: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Transaction'
});

module.exports = Transaction;
