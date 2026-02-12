const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Expense = sequelize.define(
  "Expense",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    expense_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    reason: { type: DataTypes.STRING(255), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    priority: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    // Explicit timestamp fields
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
    },
  },
  {
    tableName: "expenses",
    timestamps: true,
  },
);

module.exports = Expense;
