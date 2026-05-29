"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("deductionrule", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      deductionType: {
        type: Sequelize.ENUM(
          "Late",
          "Late+",
          "Half day",
          "Uniform break",
          "Inappropriate behaviour",
        ),
        allowNull: false,
      },
      deductionPercent: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
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
  },

  async down(queryInterface, Sequelize) {
    // Drop ENUM first to avoid leftover type in DB
    await queryInterface.dropTable("deductionrule");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_deductionrule_deductionType";',
    );
  },
};
