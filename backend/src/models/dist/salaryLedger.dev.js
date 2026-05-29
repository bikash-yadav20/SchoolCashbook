"use strict";

var _require = require("sequelize"),
    DataTypes = _require.DataTypes;

var sequelize = require("../config/db");

var SalaryLedger = sequelize.define("SalaryLedger", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.STRING(8),
    allowNull: false,
    references: {
      model: "employees",
      key: "employeeId"
    }
  },
  payableAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: DataTypes.STRING,
  periodStart: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  periodEnd: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  paidDate: DataTypes.DATE,
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "salary_ledgers",
  timestamps: true,
  indexes: [{
    unique: true,
    fields: ["employeeId", "periodStart", "periodEnd"]
  }]
});

SalaryLedger.associate = function (models) {
  SalaryLedger.belongsTo(models.Employee, {
    foreignKey: "employeeId",
    as: "employee"
  });
  SalaryLedger.hasMany(models.Deduction, {
    foreignKey: "salaryLedgerId",
    as: "deductions"
  });
};

module.exports = SalaryLedger;