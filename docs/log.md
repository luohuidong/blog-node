# 日志

server 端最为重要的就是访问日志 (access log)了。另外还有自定义日志，包括自定义事件和错误记录。

日志一般使用文本文件来存储，在记录日志之前，先了解一下 Node 读写文件的基本操作。Node 读写文件使用的是 fs 模块。

读文件：

```js
const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

fs.readFile(fileName, (err, data) => {
    if (err) {
        console.log('err: ', err)
        return
    }
    console.log('data', data.toString())
})
```

写文件：

```js
const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

const content = '内容内容内容\n'
const option = {
    flag: 'a' // 表示在文件内容后面追加内容
}

fs.writeFile(fileName, content, option, err => {
    if (err) {
        console.log('err: ', err);
    }
})
```

判断文件是否存在：

```js
const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

fs.exists(fileName, exist => {
    console.log('exist: ', exist);
})
```

`readFile` 以及 `writeFile` 有一个比较大的问题就是会读取整个文件，也就是说如果文件有几个 G 的话，就需要几个 G 的内存。但问题是系统给进程分配的内存是有限的，如果读个文件要用几个 G 的内存，整个应用会挂掉的。

上面所提到的问题，可以通过 stream (流) 来解决。数据用一点加载一点，这样在读取或者写一个比较大的文件，就不需要占用很大的内存了。

下面的例子，将通过流，实现将一个文件的内容复制到另一个文件中的功能。

```js
const fs = require('fs')
const path = require('path')

const fileName1 = path.resolve(__dirname, 'data.txt')
const fileName2 = path.resolve(__dirname, 'data2.txt')

// 创建一个读取文件的 stream (流) 对象
const readStream = fs.createReadStream(fileName1)

// 写入文件的 stream (流) 对象
const writeStream = fs.createWriteStream(fileName2)

readStream.pipe(writeStream)

readStream.on('on', function(data) {
    console.log('data: ', data.toString());
})

readStream.on('end', function() {
    console.log('拷贝完成');
})
```

上面的例子中，实现了将 data.txt 中的内容复制到 data2.txt 中。不像使用 `readFile` 和 `writeFile` 直接就将整个文件读取，使用流来读写文件是非常节省内存资源的，它是读取一部分文件就写一部分文件，因此使用流来读写比较大的文件的时候，并不会消耗很多的内存。

#### 日志拆分

- 日志内容会慢慢积累，放在一个文件中不好处理
- 按时间划分日志文件，如 2019-02-10.access.log

实现方式：Linux 的 [crontab](https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/crontab.html) 命令，既定时任务：

- 设置定时任务，格式：`***** command`
- 将 access.log 拷贝并重命名为 20xx-01-20.access.log
- 清空 access.log 文件，继续积累日志

#### 日志分析

由于日志是按行存储的，一行就是一条日志，因此可以使用 Node 中的 readline api，一行一行地读取文件。由于 readline api 是基于 stream 的，因此读取文件的效率非常高。
