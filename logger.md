# 日志系统

> 日志系统使用 [winston](https://github.com/winstonjs/winston) 实现。

## 示例

`输入`

``` js
module.exports = function (app) {
  app.locals.logger.success('整挺好！');
}
```

`输出`

``` md
# 输出消息
[server] [success] 整挺好！
# [SUCCESS] 为绿色
```

## 配置项

success: 成功信息
warning: 警告信息
error: 错误信息
info: 提示信息
debug: Debug 信息
