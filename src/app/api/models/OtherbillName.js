const { DataTypes } = require('sequelize')
const database = require('../config/db')
class OtherBillName {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'otherbillname',
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        Billid: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        BillName: {
          type: DataTypes.STRING
        },
        Price: {
          type: DataTypes.DECIMAL
        },
        Quantity: {
          type: DataTypes.INTEGER
        },
        Description: {
          type: DataTypes.STRING
        }
      },
      {
        tableName: 'otherbillnames',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = OtherBillName
