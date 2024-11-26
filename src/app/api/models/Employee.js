const { DataTypes } = require('sequelize')
const database = require('../config/db')
class Employee {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'employee',
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        Firstname: {
          type: DataTypes.STRING
        },
        Lastname: {
          type: DataTypes.STRING
        },
        Userlogin: {
          type: DataTypes.STRING
        },
        Password: {
          type: DataTypes.STRING
        },
        Email: {
          type: DataTypes.STRING
        },
        Phone: {
          type: DataTypes.STRING
        },
        Role: {
          type: DataTypes.STRING
        },
        IsDelete: {
          type: DataTypes.BOOLEAN
        },
        createDate: {
          type: DataTypes.DATE
        },
        updateDate: {
          type: DataTypes.DATE
        }
      },
      {
        tableName: 'employees',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = Employee
