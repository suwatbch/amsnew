const { DataTypes } = require('sequelize')
const database = require('../config/db')
class Room {
  constructor() {
    this.model = this.initModel()
  }
  initModel() {
    return database.sequelize.define(
      'room',
      {
        ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        TenantsID: {
          type: DataTypes.INTEGER,
        },
        RoomNumber: {
          type: DataTypes.INTEGER
        },
        TypeRoom: {
          type: DataTypes.STRING
        },
        Overdue: {
          type: DataTypes.BOOLEAN
        },
        DateSigin: {
          type: DataTypes.DATE
        },
        DateCheckout: {
          type: DataTypes.DATE
        },
        Note: {
          type: DataTypes.STRING
        },
        Status: {
          type: DataTypes.BOOLEAN
        },
        Floor: {
          type: DataTypes.INTEGER
        },
        BuildingNumber: {
          type: DataTypes.INTEGER
        },
        IsDelete: {
          type: DataTypes.BOOLEAN
        }
      },
      {
        tableName: 'rooms',
        timestamps: false
      }
    )
  }

  getModel() {
    return this.model
  }
}

module.exports = Room
