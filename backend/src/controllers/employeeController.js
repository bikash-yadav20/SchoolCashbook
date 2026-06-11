const Employee = require("../models/Employee");
const SalaryLedger = require("../models/SalaryLedger");
const { Op } = require("sequelize");
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

//update employee

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updates = req.body;

    const employee = await Employee.findOne({ where: { employeeId } });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update employee master record
    await employee.update(updates);

    // If salary is being updated, also update current ledger
    if (updates.salary) {
      await SalaryLedger.update(
        { payableAmount: updates.salary },
        {
          where: {
            employeeId,
            periodStart: { [Op.lte]: new Date() },
            periodEnd: { [Op.gte]: new Date() },
          },
        },
      );
    }

    res.status(200).json({ message: "Updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: error.message });
  }
};
