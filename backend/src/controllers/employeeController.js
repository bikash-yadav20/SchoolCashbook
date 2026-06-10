const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");
const { ValidationError, UniqueConstraintError } = require("sequelize");

//create employee

exports.createEmployee = async (req, res) => {
  try {
    const profileFile = req.file;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const employee = await Employee.create({
      ...req.body,
      profilePicture: profileFile ? profileFile.filename : null,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      employee,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0].path;

      const messages = {
        PRIMARY: "Employee ID already exists",
        employeeId: "Employee ID already exists",
        email: "Email already exists",
        phone: "Phone number already exists",
        accountNumber: "Account number already exists",
      };

      return res.status(400).json({
        success: false,
        message: messages[field] || `${field} already exists`,
      });
    }

    // Other validation errors
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: error.errors.map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get employee

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json("unable to fetch employee", error.response?.data, error.message);
  }
};
