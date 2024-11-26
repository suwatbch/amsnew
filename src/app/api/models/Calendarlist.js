const { DataTypes } = require('sequelize')
const database = require('../config/db')
class Calendatlist {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'calendarlist',
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        EmployeeID: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        Description: {
          type: DataTypes.STRING
        },
        Date: {
          type: DataTypes.DATE
        },
        IsDelete: {
          type: DataTypes.BOOLEAN
        }
      },
      {
        tableName: 'calendarlist',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = Calendatlist
