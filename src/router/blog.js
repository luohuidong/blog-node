const handleBlogRouter = (req, res) => {
  const method = req.method
  const path = req.path

  // 获取博客列表
  if (method === 'GET' && path === '/api/blog/list') {
    return {
      msg: '这是获取博客列表的接口'
    }
  }

  // 获取博客详情
  if (method === 'GET' && path === '/api/blog/detail') {
    return {
      msg: '博客详情接口'
    }
  }

  // 新建一篇博客
  if (method === 'POST' && path === '/api/blog/new') {
    return {
      msg: '新增博客接口'
    }
  }

  // 删除博客
  if (method === 'POST' && path === '/api/blog/del') {
    return {
      msg: '删除博客接口'
    }
  }
}

module.exports = handleBlogRouter
