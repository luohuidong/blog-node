原生 Node 开发的简易博客 server，适合用于理解原理。在真正的项目中，并不会使用像项目中那样使用原生 Node 去开发业务，而是会使用像 Express，Koa，Hapi 之类的框架。

项目依赖：

- [cross-env](https://github.com/kentcdodds/cross-env)：使在命令中定义的环境变量能跨 Windows, Linux, Mac 平台使用。
- [dotenv](https://github.com/motdotla/dotenv)：用于加载 .env 文件中定义的环境变量，环境变量将保存在 `process.env` 对象中。
- [mysql](https://github.com/mysqljs/mysql)：用于操作 MySQL 数据库。
