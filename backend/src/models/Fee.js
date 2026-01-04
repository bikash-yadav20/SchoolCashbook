const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Fee = sequelize.define('Fee', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  online_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  cash_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  reason: { type: DataTypes.STRING(255), allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false },

  // Explicit timestamp fields
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  }
}, { 
  tableName: 'fees',
  timestamps: true
});

module.exports = Fee;
