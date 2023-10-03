const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Share extends Model {}

Share.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    symbol: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true
    },
    latest_price: {
        type: DataTypes.DECIMAL(10, 2),
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
    modelName: 'Share'
});

Share.associate = function(models) {
  Share.hasMany(models.Portfolio, { as: 'Portfolios', foreignKey: 'shareId' });
};

module.exports = Share;
