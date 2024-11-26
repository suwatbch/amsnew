const { DataTypes } = require('sequelize')
const database = require('../config/db')
class CommonBill {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'commonbill',
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
        BasePriceRoom: {
          type: DataTypes.DECIMAL
        },
        ElectricityBill: {
          type: DataTypes.DECIMAL
        },
        WaterBill: {
          type: DataTypes.DECIMAL
        },
        IsDelete: {
          type: DataTypes.BOOLEAN
        }
      },
      {
        tableName: 'commonbills',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = CommonBill
