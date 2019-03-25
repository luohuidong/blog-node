const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method
  const path = req.path

  // 登录
  if (method === 'POST' && path === '/api/user/login') {
    const { username, password } = req.body

    return login(username, password).then(data => {
      if (data.username) {
        // 设置 session
        req.session.username = data.username
        req.session.realname = data.realname
        
        // 同步到 redis 中
        set(req.sessionId, req.session)

        return new SuccessModel('登录成功')
      } else {
        return new ErrorModel('登录失败')
      }
    }).catch(error => {

    })
  }

  // 登录验证
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({
        session: req.session
      }))
    } else {
      return Promise.resolve(new ErrorModel('未登录'))
    }
  }
}

module.exports = handleUserRouter 
