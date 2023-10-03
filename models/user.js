module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true
      }
    });
  
    return User;
  };
  