const env = process.env.NODE_ENV // 环境参数
const { 
  DEV_DB_HOST, DEV_DB_USER, DEV_DB_PASSWORD, DEV_DB_DATABASE 
} = process.env

let MYSQL_CONF

if (env === 'dev') {
  MYSQL_CONF = {
    host: DEV_DB_HOST,
    user: DEV_DB_USER,
    password: DEV_DB_PASSWORD,
    database: DEV_DB_DATABASE
  }
}

if (env === 'production') {

}

module.exports = {
  MYSQL_CONF
}
