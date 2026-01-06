const sequelize = require("../config/db");
const User = require("./User");
const Fee = require("./Fee");
const Expense = require("./Expense");
const DailyCashBalance = require("./dailyCashBalance")(
  sequelize,
  require("sequelize").DataTypes
);

// Associations (optional)
Fee.belongsTo(User, { foreignKey: "created_by" });
Expense.belongsTo(User, { foreignKey: "created_by" });

module.exports = { sequelize, User, Fee, Expense, DailyCashBalance };
