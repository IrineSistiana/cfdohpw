# cfdohpw

全称 Cloudflare DoH proxy worker。

借助 [Cloudflare Workers](https://workers.cloudflare.com/) 平台，无需服务器，中转 DoH 流量。

## 如何使用

### 不用软件只需浏览器点鼠标

1. 注册 Cloudflare 账号。(此处省略一万字，有问题请 Google 教程很多。)
2. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/login/)。
3. 导航栏找到 [Workers]。点击进入 Workers 设置页。
4. 内容页面点 [Create a Service] 按钮。进入 Create a Service 设置页。
5. [Service name] 框可以给这个 worker 起个名字。随便。
6. 其他设置框不用管。点 [Create Service] 按钮。成功创建 worker，进入这个 worker 的信息和设置页。
7. 记下 worker 的地址，在 [Router] 栏。格式是 `<worker_name>.<user_name>.workers.dev`。
8. 在设置区找到 [Resources] 页的 [Worker] 的框内，点 [Quick edit] 按钮。进入 Worker 的代码页。
9. 将本项目的 index.js 内容全选复制替换掉默认的模板代码。
10. 点 [Save and Deploy] 按钮。提交代码。

好了，现在 `https://<worker_name>.<user_name>.workers.dev/dns-query` 就可以作为 DoH 服务器地址了。

### Command-line (Wrangler)

(此处省略一万字)

## 避免公用

原则上 DoH 服务器的地址都是 `https://<server_addr>/dns-query`。

可以修改 index.js 中的 `endpointPath` 参数来改变默认的路径，也就是 `/dns-query`，避免公用。

比如

```js
const endpointPath = '/dns-query-with-my-passwd-123456';
```

则服务器地址变成 `https://<server_addr>/dns-query-with-my-passwd-123456`。除非请求者知道正确的路径地址，否则 worker 会返回 404。

## Credit

- [Cloudflare Workers](https://workers.cloudflare.com/)