"use strict";

// models/index.js
var sequelize = require("../config/db");

var User = require("./User");

var Fee = require("./Fee");

var Expense = require("./Expense");

var SalaryLedger = require("./salaryLedger");

var Employee = require("./Employee");

var Deduction = require("./deductions");

var DeductionRule = require("./deductionRules");

var DailyCashBalance = require("./dailyCashBalance")(sequelize, require("sequelize").DataTypes); // Associations


Fee.belongsTo(User, {
  foreignKey: "created_by"
});
Expense.belongsTo(User, {
  foreignKey: "created_by"
}); // Employee ↔ SalaryLedger

Employee.hasMany(SalaryLedger, {
  foreignKey: "employeeId",
  as: "SalaryLedgers"
});
SalaryLedger.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "Employee"
}); // SalaryLedger ↔ Deduction

SalaryLedger.hasMany(Deduction, {
  foreignKey: "salaryLedgerId",
  as: "Deductions"
});
Deduction.belongsTo(SalaryLedger, {
  foreignKey: "salaryLedgerId",
  as: "SalaryLedger"
});
module.exports = {
  sequelize: sequelize,
  User: User,
  Fee: Fee,
  Expense: Expense,
  DailyCashBalance: DailyCashBalance,
  SalaryLedger: SalaryLedger,
  Employee: Employee,
  Deduction: Deduction,
  DeductionRule: DeductionRule
};