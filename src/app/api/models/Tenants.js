const { DataTypes } = require('sequelize')
const database = require('../config/db')
class Tenant {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'tenants',
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
        IDcard: {
          type: DataTypes.STRING
        },
        Phone: {
          type: DataTypes.INTEGER
        },
        Address: {
          type: DataTypes.STRING
        },
        Status: {
          type: DataTypes.BOOLEAN
        },
        Building:{
          type: DataTypes.STRING
        },
        ContactAbout:{
          type: DataTypes.INTEGER
        },
        IsDelete: {
          type: DataTypes.BOOLEAN
        },
        Images: {
          type: DataTypes.STRING
        },
        createDate: {
          type: DataTypes.DATE
        },
        updateDate: {
          type: DataTypes.DATE
        },
        createBy: {
          type: DataTypes.INTEGER
        }
      },
      {
        tableName: 'tenants',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = Tenant
