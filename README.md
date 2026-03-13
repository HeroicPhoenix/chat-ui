# chat-ui

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


## 后端地址配置（重要）

本项目请求地址来自环境变量 `VITE_API_BASE_URL`，代码位置：`src/api/request.js`。

### 1) 新建环境变量文件
在项目根目录创建 `.env.development`（本地开发）并填写：

```sh
VITE_API_BASE_URL=http://127.0.0.1:8080
```

如果后端部署在其他地址（如测试环境），改成对应域名或 IP 即可，例如：

```sh
VITE_API_BASE_URL=https://api.example.com
```

> 注意：不要以 `/` 结尾，避免出现双斜杠路径。

### 2) 重启前端服务
修改环境变量后，需要重启 Vite：

```sh
npm run dev
```

### 3) 可选：生产环境
生产构建可在 `.env.production` 中设置：

```sh
VITE_API_BASE_URL=https://api.example.com
```

也可参考仓库中的 `.env.example` 作为模板。


### 4) 附件下载接口配置（图片/音乐/文件）
前端下载按钮会优先使用消息里返回的 `attachment.downloadUrl` / `fileUrl`。
如果后端不返回下载地址，前端会回退到：

```sh
VITE_ATTACHMENT_DOWNLOAD_PATH=/api/file/download
```

并按 `attachmentId` 拼接请求，例如：

```text
{VITE_API_BASE_URL}{VITE_ATTACHMENT_DOWNLOAD_PATH}?attachmentId=123
```

如果你的后端下载接口路径不同，请在 `.env.development` / `.env.production` 里覆盖该变量。
