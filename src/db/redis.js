const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

const { host, port } = REDIS_CONF

// 创建客户端
const client = redis.createClient({ host, port })

client.on('error', err => {
  console.log('err', err)
})

function redisSet(key, val) {
  if (typeof val === 'object') {
    // 如果 val 是一个对象，则将它转化为 JSON 进行存储
    val = JSON.stringify(val)
  }
  client.set(key, val, redis.print)
}

function redisGet(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, val) => {
      if (err) {
        reject(err)
      }

      if (val == null) {
        resolve(null)
      }

      try {
        // 如果是一个 Json，则对它进行解析
        resolve(JSON.parse(val))
      } catch (error) {
        // 否则直接返回 value
        resolve(val)
      }
    })
  })
}

module.exports = {
  redisSet,
  redisGet
}
