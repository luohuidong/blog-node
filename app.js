require('dotenv').config()

const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { redisGet, redisSet } = require('./src/db/redis')
const { ErrorModel } = require('./src/model/resModel')
const { writeLog } = require('./src/utils/log')

const serverHandle = (req, res) => {
  // 记录 access log
  writeLog(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

  // 设置 JSON 返回格式
  res.setHeader('Content-type', 'application/json')

  // 获取 path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie
  const cookie = parseCookie(req)
  req.cookie = cookie

  // 解析 session
  let needSetCookie = false // 是否需要设置 Cookie
  let userId = req.cookie.userId // cookie 中是否存在 userId
  if (!userId) {
    // 如果 Cookie 中没有 userId, 则标记为需要设置 Cookie
    // 生成一个 userId
    needSetCookie = true
    userId = `${Date.now()}_${Math.random()}`
  }

  // 将 sessionId 设置为 userId，后面的登录路由处理会用到
  req.sessionId = userId

  // 通过 userId 获取存储在 Redis 中的数据
  redisGet(req.sessionId).then(sessionData => {
    if (sessionData === null) {
      // 当对应的 sessionId 在 redis 中没有值的时候，
      // 在 redis 中将其值设置为空对象
      redisSet(req.sessionId, {})
      req.session = {}
    } else {
      req.session = sessionData
    }

    return getPostData(req)
  }).then(postData => {
    req.body = postData

    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      return blogResult.then(blogData => {
        if (needSetCookie) {
          setCookie(res, userId)
        }
        res.end(JSON.stringify(blogData))
      }).catch(err => {
        res.end(JSON.stringify(new ErrorModel(err)))
      })
    }

    // 处理 user 路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      if (needSetCookie) {
        setCookie(res, userId)
      }
      return userResult.then(userData => {
        res.end(JSON.stringify(userData))
      })
    }

    // 未命中路由，返回 404
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.write('404 Not Found\n')
    res.end()
  })
}

/**
 * 用于处理请求中 post 的数据
 * @param {object} req
 */
function getPostData(req) {
  const promise = new Promise((resolve) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}

/**
 * 解析请求中的 cookie
 * 将 cookie 中的键值对通过对象的形式存储
 * @param {object} req
 */
function parseCookie(req) {
  let cookie = {}

  const cookieStr = req.headers.cookie || ''

  cookieStr.split(';').forEach(item => {
    if (!item) {
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()
    const val = arr[1]
    cookie[key] = val
  })

  return cookie
}

/**
 * 设置 cookie
 * @param {object} res
 * @param {string} userId
 */
function setCookie(res, userId) {
  res.setHeader('Set-Cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
}

/**
 * 获取 Cookie 的过期时间
 */
function getCookieExpires() {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  return d.toGMTString()
}

module.exports = serverHandle
