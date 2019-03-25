const env = process.env.NODE_ENV // 环境参数
const { 
  DEV_DB_HOST, DEV_DB_USER, DEV_DB_PASSWORD, DEV_DB_DATABASE 
} = process.env

let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
  // MySQL
  MYSQL_CONF = {
    host: DEV_DB_HOST,
    user: DEV_DB_USER,
    password: DEV_DB_PASSWORD,
    database: DEV_DB_DATABASE
  }

  // Redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

if (env === 'production') {
  // MySQL..
  // Redis..
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}
