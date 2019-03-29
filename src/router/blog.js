const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 登录验证函数
const loginCheck = req => {
  return new Promise((resolve, reject) => {
    if (req.session.username) {
      resolve()
    } else {
      reject('用户未登录')
    }
  })
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const path = req.path
  const blogId = req.query.id

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''

    return getList(author, keyword).then(result => {
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
    return loginCheck(req).then((result) => {
      req.body.author = req.session.username
      return newBlog(req.body).then(result => {
        return new SuccessModel(result)
      })
    })
  }

  // 更新一篇博客
  if (method === 'POST' && path === '/api/blog/update') {
    return loginCheck(req)
      .then(() => updateBlog(blogId, req.body))
      .then(result => {
        if (result) {
          return new SuccessModel('更新博客成功')
        } else {
          return new ErrorModel('更新博客失败')
        }
      })
  }

  // 删除博客
  if (method === 'POST' && path === '/api/blog/del') {
    return loginCheck(req).then(() => {
      const author = req.session.username
      return delBlog(blogId, author)
    }).then(result => {
      if (result) {
        return new SuccessModel('删除博客成功')
      } else {
        return new ErrorModel('删除博客失败')
      }
    })
  }

}

module.exports = handleBlogRouter
