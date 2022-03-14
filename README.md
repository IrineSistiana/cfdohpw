# cfdohpw

Cloudflare DoH proxy worker。

借助 Cloudflare CDN 平台中转加速任意 DoH (RFC8484) 流量。无需服务器和域名。

## 如何使用

Worker 的代码在项目根目录的 [index.js](https://github.com/IrineSistiana/cfdohpw/blob/main/index.js)。

### 不用软件只需浏览器点鼠标

可以用 Cloudflare 网页控制台部署 worker。Cloudflare 经常更新它的网页，此处省略一万字，请 Google，教程很多。

### 命令行

需要 Cloudflare 官方工具 [wrangler](https://github.com/cloudflare/wrangler)。详见官方说明。此处省略一万字。

## 如何避免所有人都能使用该 worker

虽然平常见到的 DoH 服务器的地址都是 `https://<server_addr>/dns-query`。但这个路径 `/dns-query` 其实是可以随意改的。

可以修改 index.js 中的 `endpointPath` 参数来改变该路径。

比如设定

```js
const endpointPath = '/dns-query-with-my-passwd-123456';
```

则服务器地址变成 `https://<server_addr>/dns-query-with-my-passwd-123456`。只有知道路径的用户才能使用该 worker。

## Credit

- [Cloudflare Workers](https://workers.cloudflare.com/)
