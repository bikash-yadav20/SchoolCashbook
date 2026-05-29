"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function up$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(queryInterface.createTable("deductions", {
              id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
              },
              salaryLedgerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                  model: "salary_ledgers",
                  key: "id"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
              },
              deduction_date: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
              },
              type: {
                type: Sequelize.STRING,
                allowNull: false
              },
              absent_days: {
                type: Sequelize.INTEGER,
                allowNull: true
              },
              late_days: {
                type: Sequelize.INTEGER,
                allowNull: true
              },
              advance_amount: {
                type: Sequelize.FLOAT,
                allowNull: true
              },
              absent_amount: {
                type: Sequelize.INTEGER
              },
              pf_amount: {
                type: Sequelize.INTEGER
              },
              late_amount: {
                type: Sequelize.INTEGER
              },
              total_deduction: {
                type: Sequelize.INTEGER
              },
              description: {
                type: Sequelize.STRING
              },
              createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
              },
              updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
              }
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  down: function down(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function down$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(queryInterface.dropTable("deductions"));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};