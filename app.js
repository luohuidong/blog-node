require('dotenv').config()

const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用于处理 post data
const getPostData = req => {
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

const serverHandle = (req, res) => {
  // 设置 JSON 返回格式 
  res.setHeader('Content-type', 'application/json')

  // 获取 path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析 query
  req.query = querystring.parse(url.split('?')[1])

  // 获取 post data
  getPostData(req).then(postData => {
    req.body = postData

    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      return blogResult.then(blogData => {
        res.end(JSON.stringify(blogData))
      })
    }

    // 处理 user 路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
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

module.exports = serverHandle
