// models/index.js
const sequelize = require("../config/db");
const User = require("./User");
const Fee = require("./Fee");
const Expense = require("./Expense");
const SalaryLedger = require("./salaryLedger");
const Employee = require("./Employee");
const Deduction = require("./deductions");
const DeductionRule = require("./deductionRules");
const DailyCashBalance = require("./dailyCashBalance")(
  sequelize,
  require("sequelize").DataTypes,
);

// Associations
Fee.belongsTo(User, { foreignKey: "created_by" });
Expense.belongsTo(User, { foreignKey: "created_by" });

// Employee ↔ SalaryLedger
Employee.hasMany(SalaryLedger, {
  foreignKey: "employeeId",
  as: "SalaryLedgers",
});
SalaryLedger.belongsTo(Employee, { foreignKey: "employeeId", as: "Employee" });

// SalaryLedger ↔ Deduction
SalaryLedger.hasMany(Deduction, {
  foreignKey: "salaryLedgerId",
  as: "Deductions",
});
Deduction.belongsTo(SalaryLedger, {
  foreignKey: "salaryLedgerId",
  as: "SalaryLedger",
});

module.exports = {
  sequelize,
  User,
  Fee,
  Expense,
  DailyCashBalance,
  SalaryLedger,
  Employee,
  Deduction,
  DeductionRule,
};
