原生 Node 开发的简易博客 server，适合用于理解原理。使用原生 Node 去开发 server 很复杂，而且没有标准可言，因此代码很容易就写得很乱。因此使用原生 Node 去开发，比较适合去理解原理，但并不适合真正的应用。

在真正的项目中，很少会使用原生 Node 去开发业务，一般会使用 Express，Koa，Hapi 之类的框架，当使用框架之后，就会发现代码是非常有条例，非常清晰的。

下面两个 repo 是我分别使用 express 及 koa 去实现这个项目相同的功能，可以看出使用了 express 及 koa 代码的结构比 Node 原生去开发 server 要清晰、规范很多。

- [blog-express](https://github.com/luohuidong/blog-express)
- [blog-koa2](https://github.com/luohuidong/blog-koa2)

## 目录结构

```
.
├── bin // service 定义
└── src
    ├── conf // MySQL、redis 配置
    ├── controller // 数据库操作
    ├── db // 连接数据库、redis。操作数据库、redis
    ├── model // 规范返回前端的数据格式
    └── router // 路由处理
```

## 项目 Node 依赖

- [cross-env](https://github.com/kentcdodds/cross-env)：使在命令中定义的环境变量能跨 Windows, Linux, Mac 平台使用。
- [dotenv](https://github.com/motdotla/dotenv)：用于加载 .env 文件中定义的环境变量，环境变量将保存在 `process.env` 对象中。
- [mysql](https://github.com/mysqljs/mysql)：用于操作 MySQL 数据库。
- [node_redis](https://github.com/NodeRedis/node_redis)：用于操作 Redis。

## 功能模块

- 处理 http 接口：处理路由
- 连接数据库
- 实现登录: cookie、session、redis
- 安全措施：预防 XSS 攻击、密码加密、处理 SQL 注入
- 通过 stream 写日志，通过 readline 分析日志，contrab 定时任务

## 总结

### .env 文件

一般来说 .env 文件一般是用来存放一些比较敏感的信息，如果是公开的仓库，请在 .gitignore 中将 .env 文件过滤掉，防止 .env 上传到公开的仓库。

- [Cookie](./docs/cookie.md)
- [Session](./docs/session.md)
- [日志](./docs/log.md)
