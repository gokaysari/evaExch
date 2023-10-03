module.exports = (sequelize, DataTypes) => {
    const Portfolio = sequelize.define('Portfolio', {
      userId: DataTypes.INTEGER,
      shareId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER
    });
  
    Portfolio.associate = (models) => {
      Portfolio.belongsTo(models.User, { foreignKey: 'userId' });
      Portfolio.belongsTo(models.Share, { foreignKey: 'shareId' });
    };
  
    return Portfolio;
  };
  