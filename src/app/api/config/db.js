const { Sequelize } = require('sequelize')
const dbConfig = require('./dbConfig')
const pg = require('pg')
class Db {
  constructor() {
    this.sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
      host: dbConfig.HOST,
      port: Number(dbConfig.PORT),
      dialect: dbConfig.dialect,
      dialectModule: pg,
      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
      },
      dialectOptions: dbConfig.dialectOptions
    })
  }
  testConnection() {
    this.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err)
      })
  }
}

module.exports = new Db()