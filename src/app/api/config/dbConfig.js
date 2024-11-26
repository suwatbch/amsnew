module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE,
  dialect: 'postgres',
  PORT: process.env.DB_PORT,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true, //allow SSL
      rejectUnauthorized: false // connect only sometime SSL issue
    }
  }
}
// DB_USER='admin'
// DB_HOST='dpg-cs2j0le8ii6s739jfvug-a.oregon-postgres.render.com'
// DB_DATABASE='ams_database_ckl1'
// DB_PASSWORD='urPLhYbXITb0PaSjv1aPWaCDj8bntOBB'
// DB_PORT=5000