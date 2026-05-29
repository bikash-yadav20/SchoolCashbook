"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("deductions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      salaryLedgerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "salary_ledgers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      deduction_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      type: { type: Sequelize.STRING, allowNull: false },
      absent_days: { type: Sequelize.INTEGER, allowNull: true },
      late_days: { type: Sequelize.INTEGER, allowNull: true },
      advance_amount: { type: Sequelize.FLOAT, allowNull: true },
      absent_amount: { type: Sequelize.INTEGER },
      pf_amount: { type: Sequelize.INTEGER },
      late_amount: { type: Sequelize.INTEGER },
      total_deduction: { type: Sequelize.INTEGER },
      description: { type: Sequelize.STRING },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("deductions");
  },
};
