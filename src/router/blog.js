const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

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
    req.body.author = 'zhangsan'
    return newBlog(req.body).then(result => {
      return new SuccessModel(result)
    })
  }

  // 更新一篇博客
  if (method === 'POST' && path === '/api/blog/update') {
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
    const author = 'zhangsan'

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
