"use strict";

var _require = require("sequelize"),
    DataTypes = _require.DataTypes;

var sequelize = require("../config/db");

var Employee = sequelize.define("Employee", {
  employeeId: {
    type: DataTypes.STRING(8),
    allowNull: false,
    primaryKey: true,
    validate: {
      isAlphanumeric: true,
      len: [8, 8]
    }
  },
  profilePicture: DataTypes.STRING,
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  pf: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  DOB: {
    type: DataTypes.DATEONLY
  },
  accountNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ifsc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  presentAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permanentAddress: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "employees",
  timestamps: true
});

Employee.associate = function (models) {
  Employee.hasMany(models.SalaryLedger, {
    foreignKey: "employeeId",
    as: "salaryLedgers"
  });
};

module.exports = Employee;