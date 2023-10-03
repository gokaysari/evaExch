const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Portfolio extends Model {}

Portfolio.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
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
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
    }
}, {
    sequelize,
    modelName: 'Portfolio'
});

Portfolio.associate = function(models) {
  Portfolio.belongsTo(models.Share, { as: 'Share', foreignKey: 'shareId' });
};

module.exports = Portfolio;
