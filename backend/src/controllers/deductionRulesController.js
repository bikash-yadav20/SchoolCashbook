const deductionRule = require("../models/deductionRules");

exports.deductionRule = async (req, res) => {
  try {
    const deductionType = deductionRule.rawAttributes.deductionType.values;
    res.json(deductionType);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deduction types" });
  }
};

////create deduction DeductionRule

exports.createDeductionRule = async (req, res) => {
  try {
    const data = await deductionRule.create(req.body);
    res
      .status(200)
      .json({ message: "deduction rule created succesfully", data });
  } catch (err) {
    console.error("Failed creating rule", err);
    res.status(500).json({ error: "failed creating rule" });
  }
};

// get deduction rules.............

exports.getDeductionRules = async (req, res) => {
  try {
    const data = await deductionRule.findAll();
    res
      .status(200)
      .json({ message: "Deduction rules fetched sucessfully", data });
  } catch (error) {
    console.error("error to fetch the deduction rule data");
  }
};
