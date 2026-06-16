const { Employee, SalaryLedger } = require("../models");

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
/* get all employee details */

exports.employeeList = async (req, res) => {
  try {
    const { empStatus } = req.params;
    const employees = await Employee.findAll({
      where: { status: empStatus },
    });
    res.status(200).json({
      message: "employees fetched successfully",
      employees,
    });
  } catch (error) {
    console.error("failed to fetch employee", error);
    res.status(500).json({ message: "unable to fetch employees" });
  }
};

//get employee period wise

exports.getEmployees = async (req, res) => {
  try {
    const { periodStart, periodEnd } = req.params;
    const ledger = await SalaryLedger.findAll({
      where: { periodStart: periodStart, periodEnd: periodEnd },
      attributes: ["employeeId", "isPaid"],
    });

    const employeeIds = ledger.map((l) => l.employeeId);

    const employees = await Employee.findAll({
      where: { employeeId: employeeIds },
    });
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
    console.log(updates);

    await employee.update(updates);

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
