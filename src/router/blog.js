const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
  const method = req.method
  const path = req.path
  const blogId = req.query.id

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    const authod = req.query.authod || ''
    const keyword = req.query.keyword || ''

    const listData = getList(authod, keyword)
    return new SuccessModel(listData)
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    const data = getDetail(blogId)
    return new SuccessModel(data)
  }

  // 新建一篇博客
  if (method === 'POST' && path === '/api/blog/new') {
    const data = newBlog(req.body)
    return new SuccessModel(data)
  }

  // 更新一篇博客
  if (method === 'POST' && path === '/api/blog/update') {
    const result = updateBlog(blogId, req.body) 

    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('更新博客失败')
    }
  }

  // 删除博客
  if (method === 'POST' && path === '/api/blog/del') {
    const result = delBlog(blogId)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('删除博客失败')
    }
  }
 
}

module.exports = handleBlogRouter
