"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employees", {
      employeeId: {
        type: Sequelize.STRING(8),
        allowNull: false,
        primaryKey: true,
      },
      profilePicture: { type: Sequelize.STRING },
      firstname: { type: Sequelize.STRING, allowNull: false },
      lastname: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      phone: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      designation: { type: Sequelize.STRING, allowNull: false },
      salary: { type: Sequelize.FLOAT, allowNull: false },
      pf: { type: Sequelize.FLOAT, allowNull: false },
      DOB: { type: Sequelize.DATEONLY },
      accountNumber: { type: Sequelize.STRING, allowNull: false },
      ifsc: { type: Sequelize.STRING, allowNull: false },
      presentAddress: { type: Sequelize.STRING, allowNull: false },
      permanentAddress: { type: Sequelize.STRING, allowNull: false },

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
    await queryInterface.dropTable("employees");
  },
};
