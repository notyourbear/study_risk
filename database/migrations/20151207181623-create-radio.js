'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Radios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.STRING
      },
      false1: {
        type: Sequelize.STRING
      },
      false2: {
        type: Sequelize.STRING
      },
      false3: {
        type: Sequelize.STRING
      },
      false4: {
        type: Sequelize.STRING
      },
      false5: {
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
    return queryInterface.dropTable('Radios');
  }
};