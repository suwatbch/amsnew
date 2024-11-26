const { DataTypes } = require('sequelize')
const database = require('../config/db')
class Building {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'building',
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        Roomid: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        Tenants: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        BuildType: {
          type: DataTypes.STRING
        },
        Unit: {
          type: DataTypes.INTEGER
        },
        reserve: {
          type: DataTypes.INTEGER
        },
        IsDelete: {
          type: DataTypes.BOOLEAN
        },
      },
      {
        tableName: 'buildings',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = Building
