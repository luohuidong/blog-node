原生 Node 开发的简易博客 server，适合用于理解原理。在真正的项目中，很少会使用原生 Node 去开发业务，一般会使用 Express，Koa，Hapi 之类的框架。

## 项目 Node 依赖

- [cross-env](https://github.com/kentcdodds/cross-env)：使在命令中定义的环境变量能跨 Windows, Linux, Mac 平台使用。
- [dotenv](https://github.com/motdotla/dotenv)：用于加载 .env 文件中定义的环境变量，环境变量将保存在 `process.env` 对象中。
- [mysql](https://github.com/mysqljs/mysql)：用于操作 MySQL 数据库。
- [node_redis](https://github.com/NodeRedis/node_redis)：用于操作 Redis。

## .env 文件

一般来说 .env 文件一般是用来存放一些比较敏感的信息，如果是公开的仓库，请在 .gitignore 中将 .env 文件过滤掉，防止 .env 上传到公开的仓库。

## Cookie

HTTP 是无状态的，也就是说服务器并不知道前后两次请求是不是同一个人。而使用了 Cookie 之后，服务器就能知道前后两次请求是不是同一个人了。

Cookie 有下面一些特点：

- Cookie 是存储在浏览器的一段字符串，它是有最大限制的，一般最大 5kb。因此它并不适合存储太多东西。
- 它是跨域不共享的，例如请求淘宝的数据，那么浏览器调取的是淘宝的 Cookie，如果请求的是百度的数据，那么浏览器调取的是百度的 Cookie。
- 虽然字符串是一个非结构化的数据，但是Cookie 的格式是 `key1=value1; key2=value2; key3=value3`，因此它是可以存储结构化的数据。
- 每次发送 HTTP 请求，会将请求域的 Cookie 一起发送给 Server。
- server 可以修改 Cookie 并返回给浏览器。
- 浏览器中也可以通过 JavaScript 修改 Cookie。 

### 前端查看和修改 Cookie 

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

### Node 查看 Cookie

```js
...
const server = http.createServer((req, res) => {
    ...
    const cookie = req.headers.cookie
    ...
});
...
```

### Node 解析 Cookie

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

### 限制前端修改 Cookie 的影响

Node 设置 Cookie：

```js
res.setHeader('Set-Cookie', 'userId=123; path=/; httpOnly;')
```

设置完之后，前端通过 `document.cookie` 是获取不到 userId 这个记录的。可以理解为 userId 这条记录对前端隐藏了，使得前端既获取不到它的值，也不能给 userId 赋值。

## Session

在 Cookie 中存放用户的信息是比较危险了，例如在 Cookie 中存放用户的 username，用户的 username 很有可能是他的邮箱或者是手机，总不可能将这些敏感的信息放在 Cookie 中吧。另外 Cookie 存储信息也有大小的限制。

不想在 Cookie 中存放存放用户信息，但是又想识别用户身份，那怎么解决呢？一般会在 Cookie 存一个标识，假设这个标识叫 sid (session id)，这个标识别人看不懂，也不了解是什么意思。但这个标识能够在 server 端找到对应的用户数据，这样其实就确认了请求时用户的身份了。这个解决方案就叫 Session，它是一个存储会话信息的统称。

也就是说，不通过 Cookie 来存储用户信息了，改为通过 server 端来存储用户的信息。在 server 端存储信息，一方面是存储的信息大小没有限制，即便是服务器空间不够也可以扩展。另一方面就是也避免了通过 Cookie 暴露用户敏感信息的危险。

### redis

一般 Session 是不会通过变量来存储了，因为通过变量来存储的话，是放在 Node 进程的内存中。但是操作系统分配给 Node 进程的内存是有限的，如果访问量过大的话，内存暴增，超过系统分配给 Node 进程的内存上线，进程是话挂掉的。另外一般正式上线之后，运行是多进程的，进程之间内存无法共享。

为了解决上面所说的问题，可以通过 redis 来解决。redis 是 web server 最常用的缓存数据库，数据存放在内存中。与 MySQL 相比，redis 的访问速度快。但是 redis 的成本更高，可存储的数据量更小，断电之后数据消失，当然这些都是内存的特点。

session 的以下几个特点，使得使用 redis 更为合适：

- 访问频繁对性能要求极高。 
- 可不考虑断电丢失数据的问题，因为数据存储的并不是一些丢了就不行的数据。例如 session 存储的是登录之后的用户信息，那么这些信息丢了之后，只要用户重新登录，这些信息又会添加到 session 中。
- 相比 MySQL 中存储的数据，session 存储的数据量不会太大。

redis 基本使用：

设置键值对：

```bash
set [key] [value]
```

读取值：

```bash
get [key]
```

获取所有设置了的 keys

```bash
keys *
```

删除某个 key

```bash
del [key]
```
