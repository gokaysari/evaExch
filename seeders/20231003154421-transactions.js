'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Transactions', [
      {
        userId: 1,
        shareId: 1,
        type: 'BUY',
        quantity: 50,
        price_at_transaction: 150.25, // Sample price for 'AAP'
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        shareId: 2,
        type: 'BUY',
        quantity: 10,
        price_at_transaction: 2800.75, // Sample price for 'GOO'
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        shareId: 1,
        type: 'SELL',
        quantity: 5,
        price_at_transaction: 150.25,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Transactions', null, {});
  }
};
