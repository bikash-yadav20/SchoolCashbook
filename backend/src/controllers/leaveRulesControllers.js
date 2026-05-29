const LeaveRule = require("../models/leaveRule");

exports.leaveTypes = async (req, res) => {
  try {
    const leaveTypes = LeaveRule.rawAttributes.leaveType.values;
    res.json(leaveTypes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leave types" });
  }
};

// create leave rule----------------------

exports.createLeaveRule = async (req, res) => {
  try {
    const data = await LeaveRule.create(req.body);

    res.status(200).json({ message: "Leave rule created succesfully" });
  } catch (error) {
    console.error("Error creating leave rule", error);
    res.status(500).json({ error: "failed to create" });
  }
};

//get leave rule ------------------

exports.getLeaveRule = async (req, res) => {
  try {
    const leaveRules = await LeaveRule.findAll();

    res.status(200).json({
      message: "Leave rules fetched successfully",
      data: leaveRules,
    });
  } catch (error) {
    console.error("Failed to fetch leave rules:", error);
    res.status(500).json({ error: "Failed to fetch leave rules" });
  }
};
