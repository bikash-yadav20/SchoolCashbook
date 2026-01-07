module.exports = (sequelize, DataTypes) => {
  const DailyCashBalance = sequelize.define("DailyCashBalance", {
    date: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
    opening_balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    cash_fees_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    expenses_total: { type: DataTypes.DECIMAL(10, 2) },
    closing_balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    next_opening_balance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  });
  return DailyCashBalance;
};
