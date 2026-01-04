const Joi = require('joi');

const feeSchema = Joi.object({
  total_amount: Joi.number().min(0).required(),
  online_amount: Joi.number().min(0).required(),
  reason: Joi.string().max(255).required(),
  date: Joi.string().isoDate().optional(), // DateOnly accepted ISO (YYYY-MM-DD)
});

const expenseSchema = Joi.object({
  expense_amount: Joi.number().min(0).required(),
  reason: Joi.string().max(255).required(),
  date: Joi.string().isoDate().optional(),
});

module.exports = {
  feeSchema,
  expenseSchema,
};
