const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 登录验证函数
const loginCheck = req => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('未登录'))
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const path = req.path
  const blogId = req.query.id

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const authod = req.query.author || ''
    const keyword = req.query.keyword || ''

    return getList(authod, keyword).then(result => {
      return new SuccessModel(result)
    })
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    return getDetail(blogId).then(result => {
      return new SuccessModel(result)
    })
  }

  // 新建一篇博客
  if (method === 'POST' && path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheck
    }

    req.body.author = req.session.username
    return newBlog(req.body).then(result => {
      return new SuccessModel(result)
    })
  }

  // 更新一篇博客
  if (method === 'POST' && path === '/api/blog/update') {

    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheck
    }

    return updateBlog(blogId, req.body).then(result => {
      if (result) {
        return new SuccessModel('更新博客成功')
      } else {
        return new ErrorModel('更新博客失败')
      }
    })
  }

  // 删除博客
  if (method === 'POST' && path === '/api/blog/del') {
    // 登录验证
    const loginCheckResult = loginCheck(req)
    if (loginCheckResult) {
      // 未登录
      return loginCheck
    }

    const author = req.session.username

    return delBlog(blogId, author).then(result => {
      if (result) {
        return new SuccessModel('删除博客成功')
      } else {
        return new ErrorModel('删除博客失败')
      }
    })
  }

}

module.exports = handleBlogRouter
