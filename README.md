# MINDY OS — 鐘敏恩的互動式作品集

> AI 不光是解決問題的工具，也可以創造更多可能。

純 HTML / CSS / JavaScript 網站：不需安裝任何套件、不需 API Key、可離線使用，也能直接部署到 GitHub Pages。

---

## 1. 資料夾結構

```
mindy-os/
├── index.html            ← 網頁骨架（各區塊的文字也在這裡）
├── css/styles.css        ← 外觀：顏色、排版、動畫、手機版
├── js/data.js            ← ★ 最常修改：作品、簡報、合作情境、彩蛋文字
├── js/app.js             ← 互動功能（一般不需要修改）
├── js/music.js           ← 背景音樂（原創音樂盒旋律，可調音量 VOLUME、速度 BPM）
├── assets/cursor/        ← 3D 游標圖（箭頭、小花）
├── assets/mindy/         ← Mindy 角色圖（去背）
│   ├── mindy-*.webp          11 種全身姿勢：fullbody、welcome、thinking、exploring、surprise、
│   │                         thanks、ready、introducing、success、collaborating、presenting
│   ├── mindy-welcome-half.webp  手機首頁用的揮手半身圖
│   └── avatar-*.webp         臉部特寫頭像（地圖、標題旁小圓圈、彩蛋）
├── assets/works/         ← 放作品截圖（見裡面的 README）
├── assets/fonts/         ← 網站字體：粉圓體（標題、簡報）、思源黑體（內文）精簡版與授權
├── assets/qr-connect.svg ← 簡報第 8 頁的 QR code（連到網站合作填寫區）
├── docs/表單設定教學.md   ← ★ 合作意願表單連接 Google 試算表的步驟
├── docs/google-apps-script.gs ← 貼到 Google Apps Script 的收件程式
├── docs/CODEX_TASK.md    ← 原始開發需求
├── docs/TESTING.md       ← 測試紀錄
└── .nojekyll             ← 讓 GitHub Pages 原樣發布檔案
```

## 2. 在自己電腦預覽

**最簡單：** 直接雙擊 `index.html`，用 Chrome / Safari 開啟即可。

**比較接近正式網站（建議）：** 在資料夾中開啟終端機，執行：

```bash
python3 -m http.server 8080
```

然後用瀏覽器打開 <http://localhost:8080>。

## 3. 常見修改

| 想做的事 | 改哪裡 |
| --- | --- |
| 改作品文字、加作品 | `js/data.js` 的 `projects` |
| 放入真實作品截圖 | 圖放到 `assets/works/`，再填 `projects` 的 `images`（說明見 `assets/works/README.md`） |
| 改簡報內容、講稿、建議秒數 | `js/data.js` 的 `slides` |
| 改合作情境 | `js/data.js` 的 `matches` |
| 連接合作意願表單 | 照 `docs/表單設定教學.md` 操作，把網址貼到 `js/data.js` 的 `form.endpoint` |
| 改彩蛋台詞 | `js/data.js` 的 `mindySays`、`plantMessages` |
| 改「工作之外」興趣台詞 | `js/data.js` 的 `hobbies` |
| 某個詞被拆成兩行 | 把那個詞加進 `js/app.js` 的 `KEEP_WORDS` |
| 改各區塊標題、介紹 | `index.html`（每區都有 `<!-- ===== -->` 註解標示） |
| 改品牌色 | `css/styles.css` 最上方的 `:root` |

**標題斷行小技巧：** 標題中用 `<span class="phrase">…</span>` 包住「不想被拆開的詞組」，手機上就只會在詞組之間換行。

## 4. 簡報模式（2026/11/6 發表用）

- 開啟方式：右上角「▶ 簡報模式」，或網址後面加 `#present`（例如 `https://你的網址/#present`）。`#present-5` 可直接跳到第 5 頁。
- 換頁：`→` / `↓` / 空白鍵 / `PageDown`（簡報筆）下一頁；`←` / `↑` / `PageUp` 上一頁；`Home` / `End` 首頁 / 末頁。
- 手機、平板：左右滑動換頁，或按下方按鈕。
- `N`：顯示 / 隱藏重點提示（含每頁建議秒數，8 頁合計 420 秒 ≈ 7 分鐘）。⚠ 會投影出來，觀眾也看得到。完整逐字稿見 `docs/發表文字稿.md`。
- `F`：全螢幕（瀏覽器不支援時會顯示提示，簡報照常使用）。
- 左上計時器：顯示已講時間，超過 7 分鐘會變色；點一下可歸零。
- `Esc`：結束簡報。最後一頁按「回到首頁 ↺」也會結束。

**發表當天建議：** 事先在發表用電腦開好網址 → 按 `F` 全螢幕 → 用 `N` 確認講稿後再關掉 → 點計時器歸零後開始。

### 簡報字體
簡報模式使用 jf open 粉圓（Huninn，SIL OFL 1.1 開源授權）。`assets/fonts/huninn-mindy.woff2` 只收錄網站目前用到的字（約 170KB），沒有網路也能顯示；之後若在簡報加入新的字，會自動改用 Google Fonts 的粉圓體補上（需網路）。發表前如果改過簡報文字，可以請我重新產生字體檔。

### 第 8 頁 QR code
連到 `https://mindy9805.github.io/mindy-os/#connect`，掃描後直接打開合作填寫區。若網址改變，需要重新產生 `assets/qr-connect.svg`。

## 5. 彩蛋

- 點首頁的 Mindy：她會跳一下並說話。
- 右下角 🌱：每點一次好奇心 +1，植物會長大，第 5 次開花、Mindy 會探頭（瀏覽器會記住進度）。
- 在鍵盤上輸入 `mindy`：Mindy 從左下角探頭。
- 連點左上 Logo 5 次：系統版本「升級」。
- User Manual 裡的「查看隱藏系統訊息」。
- 桌機版探索地圖：滑鼠移到目的地，小 Mindy 會走過去。

## 6. 部署到 GitHub Pages（產生公開網址）

### 方法 A：用網頁上傳（不需要指令）
1. 登入 GitHub → 右上角「+」→ **New repository**。
2. Repository name 輸入例如 `mindy-os`，選 **Public**，按 **Create repository**。
3. 在新頁面點 **uploading an existing file**，把本資料夾「裡面的所有檔案與資料夾」拖進去（`index.html` 要在最外層），按 **Commit changes**。
   - `.nojekyll` 是隱藏檔，若拖不進去也沒關係，網站一樣能運作。
4. 進入 **Settings → Pages**：Source 選 **Deploy from a branch**，Branch 選 **main**、資料夾 **/(root)**，按 **Save**。
5. 等 1～3 分鐘，重新整理該頁，上方會出現網址：`https://你的帳號.github.io/mindy-os/`。

### 方法 B：用 git 指令
```bash
git remote add origin https://github.com/你的帳號/mindy-os.git
```
```bash
git push -u origin main
```
之後同樣到 **Settings → Pages** 開啟（步驟 4）。

### 之後更新網站
修改檔案後重新上傳（或 `git push`），1～3 分鐘後網站會自動更新。若沒變化，按 `Ctrl+Shift+R`（Mac：`Cmd+Shift+R`）強制重新整理。

## 7. 仍需提供的真實素材

- [ ] 營運資料與銷售管理系統：試算表（商品主檔 / BOM / 銷售紀錄）截圖、銷售輸入網頁截圖（主打作品，最優先）
- [ ] 豆豆貼品牌：品牌視覺、文案、短影音或商品創意圖
- [ ] 日日好日 Daily Bloom：介面畫面或原型截圖
- [ ] 課堂創作實驗室：其他 AI 課堂作品
- [ ] （可選）較高解析度的 Mindy 角色圖：目前圖片寬約 300px，大螢幕投影時略顯柔焦

## 8. 隱私與內容原則

網站不收集任何資料、不使用 Cookie 或追蹤程式（瀏覽器只在本機記住小植物的點擊次數）。不放電話、家庭背景、私人生活。所有作品敘述沿用原稿，未加入未經確認的成果數字；沒有截圖的作品一律標示「概念示意｜非實際截圖」。
