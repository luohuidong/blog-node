const { exec } = require('../db/mysql')

const logincheck = (username, password) => {
  const sql = `
    SELECT 
      username, realname FROM users 
    WHERE 
      username='${username}' AND password='${password}'
  `
  return exec(sql).then(rows => {
    if (rows.length > 0) {
      return true
    } else {
      return false
    }
  })
}

module.exports = {
  logincheck
}
