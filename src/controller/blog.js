const xss = require('xss')
const { exec, escape } = require('../db/mysql')
/**
 * 获取博客文章列表 
 * @param {string} author 文章作者
 * @param {string} keyword 文章关键字
 */
const getList = (author, keyword) => {
  // 先返回假数据
  let sql = `
    SELECT * FROM blogs WHERE 1=1
  `

  if (author) {
    author = escape(author)
    sql += `AND author='${author}'`
  }

  if (keyword) {
    keyword = escape(keyword)
    sql += `AND title like '%${keyword}%'`
  }

  sql += 'ORDER BY createtime DESC;'

  return exec(sql)
}

/**
 * 获取文章详情
 * @param {string} id 文章 id
 */
const getDetail = id => {
  id = escape(id)
  const sql = `SELECT * FROM blogs WHERE id='${id}'`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

/**
 * 新增博客
 * @param {object} blogData 博客内容
 */
const newBlog = (blogData ={}) => {
  let { title, content, author } = blogData
  
  title = xss(title)
  title = escape(title)

  content = xss(content)
  content = escape(content)

  author = escape(author)

  const createTime = Date.now()

  const sql = `
    INSERT INTO blogs (title, content, createtime, author)
    VALUES ('${title}', '${content}', '${createTime}', '${author}')
  `
  return exec(sql).then(result => {
    const { insertId } = result
    return {
      id: insertId
    }
  })
}

/**
 * 更新博客
 * @param {string} id 博客 id
 * @param {object} blogData 博客数据
 */
const updateBlog = (id, blogData = {}) => {
  let { title, content } = blogData

  title = escape(title)
  content = escape(content)
  id = escape(id)

  const sql = `
    UPDATE blogs 
    SET title='${title}', content='${content}' 
    WHERE id=${id}
  `
  return exec(sql).then(result => {
    const { affectedRows } = result
    if (affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

/**
 * 删除指定博客
 * @param {string} id 博客 id
 */
const delBlog = (id, author) => {
  id = escape(id)
  author = escape(author)

  const sql = `DELETE FROM blogs WHERE id='${id}' AND author='${author}'`
  return exec(sql).then(result => {
    const { affectedRows } = result
    if (affectedRows > 0) {
      return true
    } else {
      return false
    }
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
}
