# 澄 · 云隙空间 — 部署指南

## 项目结构

```
cheng-demo/
├── api/
│   └── chat.js          # Vercel Serverless Function（API 中转，保护 Key）
├── src/
│   ├── main.jsx
│   └── App.jsx          # 主界面
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 部署步骤（约 5 分钟）

### 第一步：上传到 GitHub

1. 去 [github.com](https://github.com) 新建一个仓库（比如 `cheng-demo`）
2. 把这个文件夹的所有文件上传进去
   - 可以直接拖拽上传，也可以用 git 命令

### 第二步：部署到 Vercel

1. 去 [vercel.com](https://vercel.com)，用 GitHub 账号登录
2. 点击 **"Add New Project"** → 选择你刚创建的仓库
3. Framework Preset 选 **Vite**，其他默认，点 **Deploy**

### 第三步：添加 API Key（关键）

部署成功后：
1. 进入项目 → **Settings** → **Environment Variables**
2. 添加一条：
   - Name: `ANTHROPIC_API_KEY`
   - Value: 你的 Anthropic API Key（`sk-ant-...`）
3. 点 **Save**，然后回到 **Deployments** 点 **Redeploy**

✅ 完成！Vercel 会给你一个 `xxx.vercel.app` 的链接，发给任何人都可以直接使用。

---

## 安全说明

- API Key 存在 Vercel 环境变量中，**不会暴露给用户**
- 所有请求经过 `api/chat.js` 中转，前端看不到 Key
- 如需限制使用量，可在 Anthropic 控制台设置 usage limits

---

## 本地开发

```bash
npm install
# 新建 .env.local 文件，写入：
# ANTHROPIC_API_KEY=sk-ant-你的key
npm run dev
```
