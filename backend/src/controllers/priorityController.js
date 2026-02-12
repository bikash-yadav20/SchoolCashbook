const { Expense } = require("../models");

//pin priority expense

exports.pinExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Not found" });
    }

    expense.priority = !expense.priority;
    await expense.save();

    res.status(200).json({
      message: expense.priority ? "Expense pinned" : "Expense unpinned",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};

//get priority expense-------------

exports.getPriorities = async (req, res) => {
  try {
    const priorities = await Expense.findAll({
      where: { priority: true },
    });
    if (!priorities.length === 0)
      return res.status(404).json("No Priorities found");
    res.status(200).json(priorities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
