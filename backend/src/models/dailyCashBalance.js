module.exports = (sequelize, DataTypes) => {
  const DailyCashBalance = sequelize.define("DailyCashBalance", {
    date: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
    opening_balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    cash_fees_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    expenses_total: { type: DataTypes.DECIMAL(10, 2) },
    closing_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    next_opening_balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  });
  return DailyCashBalance;
};
