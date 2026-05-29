const { DataTypes, ENUM } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./Employee");

const Attendance = sequelize.define(
  "Attendance",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    punchIn: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    punchOut: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    totalHours: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    status: {
      typr: DataTypes.ENUM("Present", "Absent", "Late In", "Early Out"),
    },
  },
  {
    tableName: "leaves",
    timestamps: true,
  },
);

// Relationship

Employee.hasMany(Attendance, { foreignKey: "employeeId" });
Attendance.belongsTo(Employee, { primaryKey: "employeeId" });

module.exports = Attendance;
