const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Deduction = sequelize.define(
  "Deduction",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    salaryLedgerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "salary_ledgers", key: "id" },
    },
    deduction_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    type: { type: DataTypes.STRING, allowNull: false },
    absent_days: { type: DataTypes.INTEGER, allowNull: true },
    late_days: { type: DataTypes.INTEGER, allowNull: true },
    advance_amount: { type: DataTypes.FLOAT, allowNull: true },
    absent_amount: { type: DataTypes.INTEGER },
    pf_amount: { type: DataTypes.INTEGER },
    late_amount: { type: DataTypes.INTEGER },
    total_deduction: { type: DataTypes.INTEGER },
    description: DataTypes.STRING,
  },
  {
    tableName: "deductions",
    timestamps: true,
  },
);

Deduction.associate = (models) => {
  Deduction.belongsTo(models.SalaryLedger, {
    foreignKey: "salaryLedgerId",
    as: "salaryLedger",
  });
};

module.exports = Deduction;
