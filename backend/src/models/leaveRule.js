const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LeaveRule = sequelize.define(
  "LeaveRule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    leaveType: {
      type: DataTypes.ENUM("sick", "casual", "paid", "unpaid"),
      allowNull: false,
    },

    maxDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    deduction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "leave_rules",
    timestamps: true,
  },
);

module.exports = LeaveRule;
