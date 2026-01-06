"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DailyCashBalances", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        unique: true,
      },
      opening_balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      cash_fees_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      expenses_total: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      closing_balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      next_opening_balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DailyCashBalances");
  },
};
