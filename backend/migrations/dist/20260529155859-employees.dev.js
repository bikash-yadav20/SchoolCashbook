"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function up$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(queryInterface.createTable("employees", {
              employeeId: {
                type: Sequelize.STRING(8),
                allowNull: false,
                primaryKey: true
              },
              profilePicture: {
                type: Sequelize.STRING
              },
              firstname: {
                type: Sequelize.STRING,
                allowNull: false
              },
              lastname: {
                type: Sequelize.STRING,
                allowNull: false
              },
              email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
              },
              phone: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
              },
              password: {
                type: Sequelize.STRING,
                allowNull: false
              },
              designation: {
                type: Sequelize.STRING,
                allowNull: false
              },
              salary: {
                type: Sequelize.FLOAT,
                allowNull: false
              },
              pf: {
                type: Sequelize.FLOAT,
                allowNull: false
              },
              DOB: {
                type: Sequelize.DATEONLY
              },
              accountNumber: {
                type: Sequelize.STRING,
                allowNull: false
              },
              ifsc: {
                type: Sequelize.STRING,
                allowNull: false
              },
              presentAddress: {
                type: Sequelize.STRING,
                allowNull: false
              },
              permanentAddress: {
                type: Sequelize.STRING,
                allowNull: false
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
            return regeneratorRuntime.awrap(queryInterface.dropTable("employees"));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};