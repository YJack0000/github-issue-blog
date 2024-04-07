# Github blog

使用 Github Issues 作為後端，並透過 Next.js 作為網頁渲染框架。

使用技術：

-   Next.js(React.js)
    -   Server Components
    -   Server Actions
    -   App Router
-   GraphQL(apollo-client)
-   eslint + prettier

以前就做過的一些知識點搬過來：

-   [x] 使用 DaisyUI 來快速建立網頁，並且用 DaisyUI 內建的功能提供 Dark/Light mode 一定的支援。
-   [x] 使用 API Router 來做一些簡單的 API -> 新增/編輯相關，因為 Server Action 要用 form 傳送陣列比較麻煩億點點
-   [x] 使用 Lazy Loading 來優化網頁載入速度(FMP)
-   [x] 使用 Intersection Observer API 來觸發新的資料載入
-   [x] 使用 next/image 來優化圖片載入速度(LCP)
-   [ ] 使用 sitmap 生成來優化 SEO -> 相對於 SSG ，這種作法就算 issue 裡面有編輯也不需要重新部署就可以動態修正，同時又可以使用 Google Search Console 來增加曝光度。
-   [ ] 動態生成不同篇文章的 header，例如 Open Graph, Twitter Card 等等

做啥有趣的事情：

-   [x] 第一次用 Next.js(?
-   [x] 嘗試使用 Next.js 的 Server Components 作為渲染 blog post 的方式
-   [x] 希望 Blog Post 應該要有一些文字的描述，於是將 Issue 本身作為 description，第一個 comment 才作為文章內容
-   [x] 處理使用者沒登入的情況 -> 理論上還是要在一定限度內給他讀東西啦(Github PAT 當作備援)
-   [x] 分類文章，並且可以透過分類來篩選文章
-   [x] 嘗試使用 GraphQL 來取得資料

## 使用專案

要啟動專案，首先要先安裝相依套件：

```bash
npm install
```

透過以下指令來啟動專案：

```bash
npm run dev
```

透過以下指令來編譯專案：

```bash
npm run build
```
