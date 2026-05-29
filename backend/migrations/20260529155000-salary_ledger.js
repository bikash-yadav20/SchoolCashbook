"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("salary_ledgers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      employeeId: {
        type: Sequelize.STRING(8),
        allowNull: false,
        references: { model: "employees", key: "employeeId" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      payableAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      description: { type: Sequelize.STRING },
      periodStart: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      periodEnd: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      paidDate: { type: Sequelize.DATE },
      isPaid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

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

    // Add composite unique index
    await queryInterface.addIndex(
      "salary_ledgers",
      ["employeeId", "periodStart", "periodEnd"],
      {
        unique: true,
        name: "unique_employee_period",
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("salary_ledgers");
  },
};
