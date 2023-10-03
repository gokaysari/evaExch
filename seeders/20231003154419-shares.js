'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Shares', [{
      symbol: 'AAP',
      latest_price: 150.25,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      symbol: 'GOO',
      latest_price: 2800.75,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Shares', null, {});
  }
};
