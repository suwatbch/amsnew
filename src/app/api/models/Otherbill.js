const { DataTypes } = require('sequelize')
const database = require('../config/db')
class OtherBill {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'otherbill',
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
        BilledToName: {
          type: DataTypes.STRING
        },
        BilledToContact: {
          type: DataTypes.STRING
        },
        BilledToAddress: {
          type: DataTypes.STRING
        },
        BilledToCity: {
          type: DataTypes.STRING
        },
        BilledToPhone: {
          type: DataTypes.STRING
        },
        ShippedToAddress: {
          type: DataTypes.STRING
        },
        ShippedToCity: {
          type: DataTypes.STRING
        },
        ShippedToPhone: {
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
        tableName: 'otherbills',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = OtherBill
