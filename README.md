# Dcard 2024 Frontend Intern Homework: Github Issue Blog

![GitHub deployments](https://img.shields.io/github/deployments/YJack0000/github-issue-blog/production?logo=vercel&label=vercel)
![GitHub](https://img.shields.io/github/license/YJack0000/github-issue-blog)

使用 Github Issues 作為後端，並透過 Next.js 作為網頁渲染框架。


## 使用技術

-   Next.js(React.js)
    -   Server Components
    -   Server Actions
    -   App Router
-   Tailwindcss(daisyUI)
-   GraphQL(apollo-client)
-   eslint + prettier

## 專案架構

去除掉常見的設定相關檔案，主要專案中有這幾個目錄。
```
.
├── actions
├── app
|   ├── api
│   │   └── auth
│   │       └── [...nextauth]
│   │           └── route.ts
│   ├── post
│   └── sitemap.ts
├── components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── UserButton.tsx
│   ├── auth/
│   ├── post/
│   └── ui/
├── config
│   └── auth.ts
├── graphql
│   └── github.ts
├── lib
│   ├── apollo.ts
│   └── utils.ts
└── types
```

### actions/
`actions/` 檔案夾中存放對於不同操作的 Server Action，對於不同的 Server Action 會設計屬於他們的 DTO，用於資料傳遞到 Client Side。

例如 [`actions/edit-post.tsx`](https://github.com/YJack0000/github-issue-blog/blob/main/actions/edit-post.tsx) 中就存放著對於文章資料有變動相關的動作，以 `createPost` 為例，他就會有 `CreatePostReqest` 和 `CreatePostResponse` 兩種 DTO，可以在前端判斷錯誤和接收資訊時更加方便。

### app/
`app/` 檔案夾中存放對於不同頁面的 React Page 並且透過 `App Router` 來設計不同的頁面。在這之中比較需要注意的是我是在最外層 `app/sitemap.ts` 就將 Sitemap 生成完成，並不是 nested 的方式。

### components/
`components/` 檔案夾中存放對於不同頁面的 React Component，並且對於某個 page 所需要的 Component，我不會直接寫在 App Router 中，而是會在 `components/[page]` 中設計好，因為對我來說這樣可以讓 App router 更清楚展現頁面的路徑而不至於混亂。

### config/
`config/` 檔案夾中存放對於不同設定的檔案，例如 `auth.ts` 就是對於 `next-auth` 的設定。

### graphql/
`graphql/` 檔案檔案中存放對於不同 GraphQL Query 的設定，例如 `github.ts` 就是對於 Github GraphQL API 的設定。會這樣做是因為 GraphQL 的長度通常都蠻長的，希望有個統一個地方去管理 graphql 的 query。

### lib/
`lib/` 在這裡存放一些對於不同功能的設定，例如 `apollo.ts` 就是對於 Apollo Client 的設定，`utils.ts` 就是一些常用的 function，例如 cn（這個專案裡也只有用到這個）。雖然 apollo client 有對於 next.js 的試驗型套件 [next-with-apollo](https://github.com/lfades/next-with-apollo) ，目的應該也是希望在一個 Server Side 共享同一個 client，但我目前是自己實作單體式架構，確保他都會使用到同一個 client。

## 啟動專案

要啟動專案，首先要先安裝相依套件：

```bash
npm install
```

設定好相關環境變數，在 `.env` 中，可以參考 `.env.example`：
```
// 部落格中的相關資訊，沒有設定了話預設就是我的 XD
BLOG_NAME=My Blog
LINKEDIN_URL=https://www.linkedin.com/in/宇傑-鄭-3941181a3
GITHUB_URL=https://github.com/YJack0000

// blog post 來源 repo
GITHUB_BLOG_POST_OWNER=YJack0000
GITHUB_BLOG_POST_REPO=github-issue-blog-post

// 參考 https://next-auth.js.org/configuration/options#secret 生成
NEXTAUTH_SECRET=<your-app-secret>

// Github App，用於給人登入並且檢查是否可以在線編輯
GITHUB_ID=<your-github-app-client-id>
GITHUB_SECRET=<your-github-app-client-secret>

// 個人 token 給沒有登入使用者也可以看文章
GITHUB_PAT=<your-github-personal-access-token>
```

透過以下指令來啟動專案：

```bash
npm run dev
```

透過以下指令來編譯專案：

```bash
npm run build
```

## 相關項目資訊

### 功能性需求
* GitHub Login
- [x] 使用 `next-auth` 串接 Github 登入，並且在使用者為登入時使用 Github PAT 作為取得文章需的 Token
- [x] 登入時只取得使用者相關資訊和公開 repo 的訪問權限
* Post Management
- [x] 將 GitHub Issue 作為 Post
    - [x] title 為文章標題
    - [x] labels 為文章的分類標籤
    - [x] body 為文章描述（顯示在文章預覽）
    - [x] 第一個 comment 為文章主體

* 列表頁
- [x] 第一次會先在 Server Side 載入 10 筆
- [x] 每當列表滾到底部時要自動發送 API 請求，並載入額外 10 筆，直到沒有更多文章
* 文章頁
- [x] 顯示文章內容，並透過 `react-markdown` 渲染出 markdown 的內容，並透過 `rehypeRaw` 防止有需 html 的東西渲染不出來
- [x] 使用者可以在此「編輯」、「刪除」，透過 `rehype-sanitize` 防止在 Markdown 中的 XSS 攻擊
- [x] 新增 / 編輯文章時,可以使用 Modal 或跳轉至新的頁面操作
- [x] 表單驗證: title 為必填,body 至少需要 30 字

### 加分條件
- [x] 使用 TypeScript
- [x] 使用 Next.js + App Router
- [x] 調校 Web Vitals 評分（Lighthouse + Vercel)
- [x] 有處理錯誤及例外狀況 (Error Handling)，可能做得不太完全
- [x] 有部署至 Vercel

### 網站 SEO

透過動態生成 `sitemap.xml` 並丟給 Google Search Console 來同時增加準確度與被 cache 機會。[app/sitemap.ts](https://github.com/YJack0000/github-issue-blog/blob/main/app/favicon.ico)

### 網站相關評分
文章列表（調整前）：
![Screenshot 2024-04-08 at 2.25.57 AM](https://hackmd.io/_uploads/HJmSrwxxC.png)

文章頁面（調整前）：
![Screenshot 2024-04-08 at 2.24.43 AM](https://hackmd.io/_uploads/rkCxrPllR.png)

待更新調整方案...

### 錯誤處理

**可以顯示出非預期錯誤或是預期的 validation error**

![Screenshot 2024-04-08 at 10.13.49 AM](https://hackmd.io/_uploads/BJK1Q0xeC.png)

![Screenshot 2024-04-08 at 10.12.43 AM](https://hackmd.io/_uploads/r15oM0elC.png)

**參考**
[`app/post/page.tsx`](https://github.com/YJack0000/github-issue-blog/blob/main/app/post/page.tsx)
[`actions/edit-post.tsx`](https://github.com/YJack0000/github-issue-blog/blob/main/actions/edit-post.tsx)

### 小記錄

以前就做過的一些知識點搬過來：

-   [x] 使用 DaisyUI 來快速建立網頁，並且用 DaisyUI 內建的功能提供 Dark/Light mode 一定的支援。
-   [x] 使用 API Router 來做一些簡單的 API -> 新增/編輯相關，因為 Server Action 要用 form 傳送陣列比較麻煩億點點
-   [x] 使用 Lazy Loading 來優化網頁載入速度(FMP)
-   [x] 使用 Intersection Observer API 來觸發新的資料載入
-   [x] 使用 next/image 來優化圖片載入速度(LCP)
-   [x] 使用 sitmap 生成來優化 SEO -> 相對於 SSG ，這種作法就算 issue 裡面有編輯也不需要重新部署就可以動態修正，同時又可以使用 Google Search Console 來增加曝光度。
-   [ ] 動態生成不同篇文章的 header，例如 Open Graph, Twitter Card 等等

做啥有趣的事情：

-   [x] 第一次用 Next.js
-   [x] 嘗試使用 Next.js 的 Server Components 作為渲染 blog post 的方式
-   [x] 希望 Blog Post 應該要有一些文字的描述，於是將 Issue 本身作為 description，第一個 comment 才作為文章內容
-   [x] 處理使用者沒登入的情況 -> 理論上還是要在一定限度內給他讀東西啦(Github PAT 當作備援)
-   [x] 分類文章，並且可以透過分類來篩選文章
-   [x] 嘗試使用 GraphQL 來取得資料
