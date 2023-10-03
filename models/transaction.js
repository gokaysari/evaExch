module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      userId: DataTypes.INTEGER,
      shareId: DataTypes.INTEGER,
      type: DataTypes.ENUM('BUY', 'SELL'),
      quantity: DataTypes.INTEGER,
      price_at_transaction: DataTypes.DECIMAL(10, 2)
    });
  
    Transaction.associate = (models) => {
      Transaction.belongsTo(models.User, { foreignKey: 'userId' });
      Transaction.belongsTo(models.Share, { foreignKey: 'shareId' });
    };
  
    return Transaction;
  };
  