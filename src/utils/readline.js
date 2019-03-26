const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 文件名
const fileName = path.join(__dirname, '../../log', 'access.log')

// 创建 read stream
const readStream = fs.createReadStream(fileName)

// 创建 readline 对象
const rl = readline.createInterface({
  input: readStream
})

let chromeNum = 0
let sum = 0

// 逐行读取
rl.on('line', function(lineData) {
  console.log('lineData: ', lineData.includes('Chrome'));
  if (!lineData) {
    return
  }
  
  if (lineData.includes('Chrome')) {
    chromeNum++
  }

  // 记录总行数
  sum++
})

// 监听读取完成
rl.on('close', () => {
  console.log('Chrome 占比', chromeNum / sum)
})
