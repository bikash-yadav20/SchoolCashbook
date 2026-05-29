const Employee = require("../models/Employee");
const bcrypt = require("bcrypt");

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
    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
