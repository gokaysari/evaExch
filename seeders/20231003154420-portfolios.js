'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Portfolios', [
      {
        userId: 1,
        shareId: 1, // Assuming share with symbol 'AAP' has ID 1
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        shareId: 2, // Assuming share with symbol 'GOO' has ID 2
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        shareId: 1,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Portfolios', null, {});
  }
};
