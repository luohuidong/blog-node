const { exec } = require('../db/mysql')

const login = (username, password) => {
  const sql = `
    SELECT 
      username, realname FROM users 
    WHERE 
      username='${username}' AND password='${password}'
  `
  return exec(sql).then(rows => {
    if (rows.length > 0) {
      return rows[0]
    } else {
      return false
    }
  })
}

module.exports = {
  login
}
