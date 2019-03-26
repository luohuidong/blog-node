const fs = require('fs')
const path = require('path')

/**
 * 生成 write stream
 * @param {string} fileName 日志文件名称
 */
function createWriteStream(fileName) {
  const fullFileName = path.join(__dirname, '../../log', fileName)
  const writeStream = fs.createWriteStream(fullFileName, {
    flags: 'a'
  })
  return writeStream
}

const accessWriteStream = createWriteStream('access.log')

/**
 * 写日志
 * @param {string} log log 内容
 */
function writeLog(log) {
  accessWriteStream.write(log + '\n')
}

module.exports = {
  writeLog
}
