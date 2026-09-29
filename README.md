# Eric54920 Products

个人产品站点，包含站点首页、Beatify 产品页与班务簿（Class Flow）产品页。纯静态 HTML、CSS 与 JavaScript，没有构建步骤。

班务簿线上地址：<https://class.theguodong.com>

## 目录结构

```text
index.html                    站点首页
products/beatify/index.html   Beatify 产品页
products/banwubu/index.html   班务簿（Class Flow）产品页
styles/global.css             全站基础样式与共享组件
styles/home.css               首页样式
styles/product.css            Beatify 产品页样式
scripts/site.js               导航、界面切换与平台下载检测
assets/icons/                 站点与产品图标
docs/screenshots/             Beatify 产品界面截图
docs/class_flow/              班务簿产品界面截图
site.webmanifest              PWA 清单
robots.txt                    爬虫规则
```

## 本地预览

直接打开 `index.html`，或在仓库根目录启动静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/>。

## 更新约定

- 修改 CSS 或 JavaScript 后，同步提升 HTML 中对应的 `?v=` 查询参数，避免浏览器继续使用旧缓存。
- Beatify 发布新版本时，需要一并更新以下位置的版本号与下载地址：
  - `index.html` 中的下载链接与版本展示
  - `products/beatify/index.html` 中的下载链接、JSON-LD 的 `softwareVersion` 与 `downloadUrl`
  - `scripts/site.js` 中的 `releaseDownloads`
- 站点首页用于产品导航的锚点是 `#products`、`#beatify` 与 `#class-flow`，调整版块 `id` 时需要同步更新导航和产品页返回链接。
- 班务簿的试用、价格、服务条款与隐私链接统一指向 `https://class.theguodong.com`，更换域名时需要同步更新 `index.html` 与 `products/banwubu/index.html`。

## 部署

仓库根目录即为网站根目录，可直接部署到 GitHub Pages、Cloudflare Pages 或 Netlify 等静态托管服务。配置自定义域名后，取消 `robots.txt` 中的注释并填入实际的 sitemap 地址。
