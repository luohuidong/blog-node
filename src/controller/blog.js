/**
 * 获取博客文章列表 
 * @param {string} authod 文章作者
 * @param {string} keyword 文章关键字
 */
const getList = (authod, keyword) => {
  // 先返回假数据
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      createTime: 1546610491112,
      author: 'zhangsan'
    },
    {
      id: 2,
      title: '标题A',
      content: '内容A',
      createTime: 1546610491112,
      author: '李四'
    }
  ]
}

/**
 * 获取文章详情
 * @param {string} id 文章 id
 */
const getDetail = id => {
  // 先返回假数据
  return {
    id: 1,
    title: '标题A',
    content: '内容A',
    createTime: 1546610491112,
    author: 'zhangsan'
  }
}

/**
 * 新增博客
 * @param {object} blogData 博客内容
 */
const newBlog = (blogData ={}) => {
  // blogData 是一个博客对象，包含 title content 属性
  console.log('blogData', blogData);
  return {
    id: 3, // 表示新建博客，插入到数据表里面的 id
  }
}

/**
 * 更新博客
 * @param {string} id 博客 id
 * @param {object} blogData 博客数据
 */
const updateBlog = (id, blogData = {}) => {
  // blogData 是一个博客对象，包含 title content 属性

  return true 
}

/**
 * 删除指定博客
 * @param {string} id 博客 id
 */
const delBlog = id => {
  return true 
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
}
