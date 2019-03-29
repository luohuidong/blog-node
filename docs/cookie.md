
# Cookie

HTTP 是无状态的，也就是说服务器并不知道前后两次请求是不是同一个人。而使用了 Cookie 之后，服务器就能知道前后两次请求是不是同一个人了。

Cookie 有下面一些特点：

- Cookie 是存储在浏览器的一段字符串，它是有最大限制的，一般最大 5kb。因此它并不适合存储太多东西。
- 它是跨域不共享的，例如请求淘宝的数据，那么浏览器调取的是淘宝的 Cookie，如果请求的是百度的数据，那么浏览器调取的是百度的 Cookie。
- 虽然字符串是一个非结构化的数据，但是Cookie 的格式是 `key1=value1; key2=value2; key3=value3`，因此它是可以存储结构化的数据。
- 每次发送 HTTP 请求，会将请求域的 Cookie 一起发送给 Server。
- server 可以修改 Cookie 并返回给浏览器。
- 浏览器中也可以通过 JavaScript 修改 Cookie。 

## 前端查看和修改 Cookie 

通过 `document.cookie` 可以查看 Cookie，如果给 `document.cookie` 赋值，还可以更改 Cookie。

需要注意的是，通过 `document.cookie` 修改 Cookie，并不会将原来的 Cookie 覆盖掉。如：

```js
console.log(document.cookie) // 'key1=value1'

document.cookie = 'key2=value2'
console.log(document.cookie) // 'key1=value1; key2=value2'

document.cookie = 'key3=value3'
console.log(document.cookie) // 'key1=value1; key2=value2; key3=value3'
```

因此每次通过 `document.cookie` 修改 Cookie，其实就是一个累加的过程。

## Node 查看 Cookie

```js
...
const server = http.createServer((req, res) => {
    ...
    const cookie = req.headers.cookie
    ...
});
...
```

## Node 解析 Cookie

解析其实就是将 Cookie 字符串中的内容转换为对象来存储

```js
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
```

## 限制前端修改 Cookie 的影响

Node 设置 Cookie：

```js
res.setHeader('Set-Cookie', 'userId=123; path=/; httpOnly;')
```

设置完之后，前端通过 `document.cookie` 是获取不到 userId 这个记录的。可以理解为 userId 这条记录对前端隐藏了，使得前端既获取不到它的值，也不能给 userId 赋值。
