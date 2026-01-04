const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING(200), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'staff'), defaultValue: 'staff' },

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
  tableName: 'users',
  timestamps: true
});

module.exports = User;
