"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function up$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(queryInterface.createTable("salary_ledgers", {
              id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
              },
              employeeId: {
                type: Sequelize.STRING(8),
                allowNull: false,
                references: {
                  model: "employees",
                  key: "employeeId"
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
              },
              payableAmount: {
                type: Sequelize.FLOAT,
                allowNull: false
              },
              description: {
                type: Sequelize.STRING
              },
              periodStart: {
                type: Sequelize.DATEONLY,
                allowNull: false
              },
              periodEnd: {
                type: Sequelize.DATEONLY,
                allowNull: false
              },
              paidDate: {
                type: Sequelize.DATE
              },
              isPaid: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
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
            _context.next = 4;
            return regeneratorRuntime.awrap(queryInterface.addIndex("salary_ledgers", ["employeeId", "periodStart", "periodEnd"], {
              unique: true,
              name: "unique_employee_period"
            }));

          case 4:
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
            return regeneratorRuntime.awrap(queryInterface.dropTable("salary_ledgers"));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};