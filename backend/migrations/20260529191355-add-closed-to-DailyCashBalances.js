"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("DailyCashBalances", "closed", {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("DailyCashBalances", "closed");
  },
};
