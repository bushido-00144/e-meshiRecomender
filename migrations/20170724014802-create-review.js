'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      RestaurantID: {
        type: Sequelize.INTEGER
      },
      Reviewer: {
        type: Sequelize.INTEGER
      },
      Comprehensive: {
        type: Sequelize.INTEGER
      },
      Taste: {
        type: Sequelize.INTEGER
      },
      Service: {
        type: Sequelize.INTEGER
      },
      Text: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Reviews');
  }
};