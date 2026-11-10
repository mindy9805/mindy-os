# Rewire｜重塑大腦的可能

> 理解神經可塑性，重新練習思考、情緒與行為。

以 Nicole Vignola《Rewire》為學習主軸的繁體中文互動式學習網站。結合互動電子書、知識筆記、視覺化學習、個人反思與行為練習；不需登入、沒有後端，所有個人資料只存在使用者的瀏覽器（LocalStorage）。

- 正式網址（部署後）：`https://<你的帳號>.github.io/mindy-os/rewire/`
- 技術：React 18、TypeScript、Vite 5、Tailwind CSS 3、React Router（HashRouter）、Lucide Icons、Recharts、PWA（manifest + Service Worker）

## 功能總覽

| 頁面 | 路徑 | 內容 |
| --- | --- | --- |
| 首頁 Overview | `#/` | 主視覺、學習進度、Daily Rewire 七句卡片、章節卡片 |
| 每日心智練習 | `#/daily`、`#/daily/read` | 七句卡片（展開／收藏／複製）、沉浸式朗讀模式（上一句／下一句／重新開始／語音朗讀）、今日紀錄、歷史回顧與統計 |
| 深度導讀 Learn | `#/learn`、`#/learn/ch1`…`ch9` | 9 章：學習目標、核心概念、深入解釋、生活案例、示意圖、應用、互動練習、反思、3–5 題測驗、摘要、研究來源、對應心智語句、本章筆記 |
| 知識實驗室 Brain Lab | `#/lab`、`#/lab/<id>` | 神經道路模擬器、認知濾鏡實驗、身份敘事改寫器、自我對話轉換、習慣偵探、習慣養成模擬器、If-Then 產生器、證據檢視卡、七大實踐工具 |
| 14 天練習 | `#/challenge?day=N` | 進度條、補做／重做、完成勾選、每日紀錄、今日心智語句五步驟、總結、JSON／Markdown 匯出 |
| 打破慣性 Break the Pattern | `#/pattern`、`#/pattern/<習慣>`、`#/pattern/assessment`、`#/pattern/workshop` | 7 個隱形消耗習慣：每個習慣 10 段學習內容＋專屬互動工具（認可依賴覺察器、舒適圈探索地圖、消費動機檢視器、安靜五分鐘、微承諾追蹤器、成長環境盤點、短期與長期選擇模擬器）、行動實驗；21 題自我覺察評估（非診斷）；七步驟習慣改變工作坊；首頁「你最想調整哪一個習慣？」；14 天打破慣性挑戰（`#/challenge?type=pattern`）；儀表板資料區；與每日七句心智練習整合（舊網址 `#/habits` 自動轉址） |
| 7 Habits｜高效能生活實踐 | `#/habits7`、`#/habits7/<習慣>`、`#/habits7/plan` | 以柯維《與成功有約》七個習慣為理論參考的原創學習系統：三階段學習地圖（個人成功→公眾成功→自我更新）；七章各含十個學習面向，並標示內容來源類型（柯維管理哲學／心理學／神經科學／本站工具）；七個互動工具（關注圈與影響圈、人生羅盤與願景宣言、四象限優先矩陣＋本週三件要事、雙贏協商工作坊、同理溝通模擬器、團隊合作思考板〔個人工作坊，可匯出匯入〕、四維成長儀表板）；章節測驗與自我評估；與 Break the Pattern 的公開推薦規則；21 天七習慣探索計畫；儀表板資料區 |
| 反思日誌 | `#/journal`、`#/journal?tab=notes` | 日誌新增／編輯／刪除／搜尋／標籤；章節筆記依章節、類型、標籤篩選與匯出 |
| 學習儀表板 | `#/dashboard` | 章節、測驗、挑戰、Daily Rewire、練習頻率圖、情緒趨勢、最近反思、If-Then 計畫、里程碑（皆依真實資料計算） |
| 研究來源 | `#/references` | 科學證據檢視卡、完整文獻（附 DOI，無法確認者標示「待查證」） |
| 資料與隱私 | `#/data` | 本地儲存說明、完整備份（JSON）、Markdown 匯出、匯入驗證與還原、清除所有紀錄 |

其他：全站搜尋（`/` 或 `Ctrl/⌘ + K`）、淺色／深色／跟隨系統、四段字級、右側可收合筆記面板、手機抽屜選單與底部導覽、支援減少動畫偏好。

## 專案結構

```
rewire-app/
├── index.html                 # HTML 入口（含主題預載，避免閃爍）
├── public/                    # PWA：manifest、Service Worker、圖示
├── src/
│   ├── content/               # ★ 學習內容（與程式邏輯分離，修改文字只需改這裡）
│   │   ├── chapters-a/b/c.ts  #   九個章節
│   │   ├── dailyRewire.ts     #   七句每日心智語句（原文請勿修改）
│   │   ├── challenge.ts       #   14 天計畫
│   │   ├── references.ts      #   研究來源與證據檢視卡
│   │   ├── tools.ts           #   情緒詞彙、口袋句、情境題
│   │   ├── habits7.ts         #   7 Habits：七個習慣、推薦規則、21 天計畫、工具內容
│   │   ├── breakPattern.ts    #   打破慣性：七個習慣、21 題評估、工作坊、14 天挑戰任務
│   │   └── legacyHabits.ts    #   舊版自我檢視名稱（僅顯示已保存的舊資料）
│   ├── store/                 # LocalStorage 資料層（版本、容錯讀取、匯入驗證）
│   ├── lib/                   # 統計、搜尋、匯出、日期、改寫規則、語音
│   ├── components/
│   │   ├── layout/            #   頂部列、側邊欄、右側面板、手機導覽、搜尋
│   │   ├── interactive/       #   章節互動元件、測驗
│   │   ├── tools/             #   七大實踐工具
│   │   ├── daily/             #   Daily Rewire 卡片、朗讀模式、紀錄表單
│   │   ├── diagrams/          #   各章 SVG 示意圖
│   │   ├── habits7/           #   7 Habits：七個工具、學習地圖、儀表板資料區
│   │   ├── pattern/           #   打破慣性：七個工具、挑戰、儀表板資料區
│   │   ├── notes/             #   筆記編輯與清單
│   │   └── ui/                #   共用 UI（Toast、確認視窗、表單欄位）
│   └── pages/                 # 各頁面
├── e2e/smoke.cjs              # 端對端測試（Playwright）
└── scripts/make-icons.cjs     # 由 icon.svg 產生 PNG 圖示
```

## 本機開發

需要 Node.js 20 以上。

```bash
cd rewire-app
npm install
npm run dev          # 開發伺服器 http://localhost:5173
```

## 檢查與測試

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript 型別檢查
npm test             # 單元測試（資料層、統計、改寫規則、打破慣性計算）
npm run build        # 建置，輸出到上一層的 ../rewire/
npm run check        # 以上全部

# 端對端測試（需要 Playwright 與 Chromium）
npx vite preview --port 4173 &
npm run e2e
```

## 部署到 GitHub Pages

建置結果輸出到儲存庫根目錄的 `rewire/`，因此有兩種部署方式：

**方式 A：GitHub Actions（建議，修改內容後會自動重新建置）**
1. 到 GitHub 儲存庫 **Settings → Pages → Build and deployment → Source**，選擇 **GitHub Actions**（只需設定一次）。
2. 推送到 `main` 後，`.github/workflows/deploy-pages.yml` 會自動執行檢查、建置，並把整個網站（MINDY OS 作品集＋`rewire/`）一起部署。
3. 也可以在 **Actions → Deploy to GitHub Pages → Run workflow** 手動執行。

**方式 B：沿用「Deploy from a branch」**
儲存庫已包含建置好的 `rewire/` 資料夾，維持原本的分支部署設定即可使用。之後若修改 `rewire-app/` 的內容，需在本機執行 `npm run build` 並把更新後的 `rewire/` 一起提交。

**路徑說明**：Vite 使用相對路徑 `base: './'`，搭配 HashRouter（網址形如 `/rewire/#/learn/ch1`），因此放在任何子路徑都能正確載入，重新整理或分享深層連結也不會出現 404，不需要額外的 404.html 轉址設定。

## 資料與隱私

- 資料結構帶有修訂號（`revision`，目前為 3）。讀取舊版資料或舊備份時，會自動補齊新模組的預設值，不會刪除既有紀錄。

- 所有筆記、情緒紀錄、練習內容與行動計畫只存在瀏覽器 LocalStorage（鍵名 `rewire:v1`），不會傳送到任何第三方服務。
- 網站只從 Google Fonts 下載字型檔。語音朗讀使用瀏覽器內建的 SpeechSynthesis。
- 清除網站資料、更換裝置或使用無痕模式可能導致紀錄遺失，請在「資料與隱私」頁定期匯出備份。

## 內容與研究原則

- 學習解說皆為重新組織的原創文字，不複製書籍或影片中的長篇內容。
- 研究來源列出作者、年份、期刊與 DOI；開發環境無法即時連線 doi.org 比對，建議維護者點擊連結再次確認。無法確認的欄位（例如《Rewire》各版本的出版社與年份）標示「待查證」。
- 模擬器與曲線圖皆標示「概念示意／概念模型」，不代表真實神經變化數據。
- 本站練習不能取代專業心理或醫療協助（台灣 1925 安心專線，24 小時）。
