"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: function up(queryInterface, Sequelize) {
    return regeneratorRuntime.async(function up$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(queryInterface.createTable("deductionrule", {
              id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
              },
              deductionType: {
                type: Sequelize.ENUM("Late", "Late+", "Half day", "Uniform break", "Inappropriate behaviour"),
                allowNull: false
              },
              deductionPercent: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 0
              },
              description: {
                type: Sequelize.STRING,
                allowNull: true
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
            return regeneratorRuntime.awrap(queryInterface.dropTable("deductionrule"));

          case 2:
            _context2.next = 4;
            return regeneratorRuntime.awrap(queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_deductionrule_deductionType";'));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  }
};