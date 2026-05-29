const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const DeductionRule = sequelize.define(
  "DeductionRule",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deductionType: {
      type: DataTypes.ENUM(
        "Late",
        "Late+",
        "Half day",
        "Uniform break",
        "Inappropriate behaviour",
      ),
      allowNull: false,
    },
    deductionPercent: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "DeductionRule",
    timestamps: true,
  },
);

module.exports = DeductionRule;
