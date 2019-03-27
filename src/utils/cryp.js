const crypto = require('crypto')

// 密钥
const SELECT_KEY = 'WJsoa_879#2'

// MD5 加密
function md5(content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SELECT_KEY}`
  return md5(str)
}

module.exports = {
  genPassword
}
