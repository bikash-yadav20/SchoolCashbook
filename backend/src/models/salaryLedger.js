const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SalaryLedger = sequelize.define(
  "SalaryLedger",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employeeId: {
      type: DataTypes.STRING(8),
      allowNull: false,
      references: { model: "employees", key: "employeeId" },
    },
    payableAmount: { type: DataTypes.FLOAT, allowNull: false },
    description: DataTypes.STRING,
    periodStart: { type: DataTypes.DATEONLY, allowNull: false },
    periodEnd: { type: DataTypes.DATEONLY, allowNull: false },
    paidDate: DataTypes.DATE,
    isPaid: { type: DataTypes.TINYINT, defaultValue: 0 },
  },
  {
    tableName: "salary_ledgers",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["employeeId", "periodStart", "periodEnd"],
      },
    ],
  },
);

SalaryLedger.associate = (models) => {
  SalaryLedger.belongsTo(models.Employee, {
    foreignKey: "employeeId",
    as: "employee",
  });
  SalaryLedger.hasMany(models.Deduction, {
    foreignKey: "salaryLedgerId",
    as: "deductions",
  });
};

module.exports = SalaryLedger;
