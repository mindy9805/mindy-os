/* =====================================================================
   MINDY OS — 內容資料檔（不需要懂程式也能修改）
   ---------------------------------------------------------------------
   這個檔案只放「文字與資料」，網站的外觀在 css/styles.css，
   互動邏輯在 js/app.js。想改文字、新增作品、換截圖，改這裡就好。

   修改小提醒：
   1. 文字要放在引號 ' ' 或反引號 ` ` 之間。
   2. 每一筆資料之間用逗號 , 隔開，最後一筆後面多一個逗號也沒關係。
   3. 改完存檔，重新整理瀏覽器就能看到結果。
   ===================================================================== */

window.MINDY_DATA = {

  /* -------------------------------------------------------------------
     1) 角色圖片路徑
     如果之後有新的角色圖，放進 assets/mindy/ 後改這裡的檔名即可。
     ------------------------------------------------------------------- */
  images: {
    fullbody:      'assets/mindy/mindy-fullbody.webp',      // 01 全身站姿（桌機首頁）
    welcome:       'assets/mindy/mindy-welcome.webp',       // 02 揮手打招呼（簡報第 1 頁）
    thinking:      'assets/mindy/mindy-thinking.webp',      // 03 托腮思考（簡報第 3 頁）
    exploring:     'assets/mindy/mindy-exploring.webp',     // 04 拿地圖探索
    surprise:      'assets/mindy/mindy-surprise.webp',      // 05 驚喜
    thanks:        'assets/mindy/mindy-thanks.webp',        // 06 謝謝（頁尾、簡報第 8 頁）
    ready:         'assets/mindy/mindy-ready.webp',         // 07 出發（簡報第 7 頁）
    introducing:   'assets/mindy/mindy-introducing.webp',   // 08 介紹（簡報第 2 頁）
    success:       'assets/mindy/mindy-success.webp',       // 09 比讚
    collaborating: 'assets/mindy/mindy-collaborating.webp', // 10 邀請合作（簡報第 6 頁）
    presenting:    'assets/mindy/mindy-presenting.webp'     // 11 簡報說明
    /* 頭像（臉部特寫）在 assets/mindy/avatar-*.webp，用在地圖、標題旁小圓圈與彩蛋 */
  },

  /* -------------------------------------------------------------------
     3) 作品卡片（Creative Lab）
     ★ 如何放入真實截圖：
       (1) 把圖片放進 assets/works/ 資料夾（建議 1600×1000 的 .webp 或 .jpg）
       (2) 在該作品的 images 裡加入一行，例如：
           images: [
             { src: 'assets/works/sales-app-01.webp', alt: '銷售輸入網頁畫面', caption: '店員輸入銷售的網頁表單' }
           ],
       (3) 第一張圖會成為卡片封面，全部圖片會出現在「查看專案摘要」視窗中。
       (4) images 留空 [] 時，會自動顯示「概念示意圖」，並清楚標示不是實際截圖。
       (5) 作品有線上版本時，填 link（網址），卡片會出現「開啟作品」按鈕；
           有多個網址時改用 links: [{ label: '按鈕文字', url: '網址' }]。
       (6) units：對應的課堂單元（會顯示在卡片上方的小標籤）。
     cat 可用值：data（營運與資料）、brand（品牌創作）、ux（產品與 UI/UX）、experiment（AI 實驗）
     ------------------------------------------------------------------- */
  projects: [
    {
      id: 'data',
      units: ['10/29 第六單元｜營運資料架構', '11/02 第七單元｜智慧營運試算表'],
      links: [
        { label: '開啟原物料主檔系統', url: 'https://script.google.com/macros/s/AKfycbzRgW0gFZQSQYfbcTmY81GVTOl1rtqIyFBEGjYABMOclb8mo25ySs24zFU6JIukYDTwDQ/exec' },
        { label: '開啟排班薪資系統', url: 'https://script.google.com/macros/s/AKfycbw4cxtMCMJGr2gsBFFyOP6DejkZ8r1pwxZcmGJRLo7iX7AMJYuUt26u_WztOzeqWq7b/exec' }
      ],
      cat: 'data',
      label: 'DATA & AUTOMATION · 營運與資料',
      name: '營運資料與銷售管理系統',
      desc: '從商品與原物料主檔、配方 BOM，到銷售、庫存與營收毛利，再延伸出排班與薪資系統。熟悉的試算表工作，原來還能走得更遠。',
      tools: ['Excel', 'Google Sheets', 'Apps Script', 'AI 協作'],
      detail: '以豆皮鍋貼店營運為題，先規劃商品、原物料、供應商主檔與配方 BOM，再串起銷售紀錄、進貨、商品成本、庫存管理與營收毛利，並用 Apps Script 做成店員可以操作的系統網頁。之後延伸出排班與薪資系統：從薪資設定、排班、休假申請、加班與工時彙總，一路算到薪資明細。重點不只是公式，而是重新思考前台與後台的工作流程。',
      state: '試算表與系統網頁已完成',
      featured: true,
      images: [
        { src: 'assets/works/sheet-master.webp', alt: '豆豆貼鍋貼商品原物料供應商主檔試算表：設定選單、商品主檔、供應商主檔、原物料主檔、商品配方 BOM、銷售紀錄、進貨紀錄、商品成本、庫存管理、營收毛利等工作表', caption: '豆豆貼鍋貼 商品原物料供應商主檔：從設定選單、商品與原物料主檔、配方 BOM，到銷售、進貨、成本、庫存與營收毛利。' },
        { src: 'assets/works/sheet-payroll.webp', alt: '排班和薪資試算表：薪資設定與費率參數，包含獎金、加班費率、勞健保自付額與請假扣薪規則', caption: '排班和薪資：薪資設定、排班、休假申請、加班與工時彙總，一路算到薪資明細。' }
      ] // ← 在這裡放入真實截圖
    },
    {
      id: 'brand',
      units: ['10/21 第二單元｜商業提案設計力', '10/22 第三單元｜品牌視覺生成術'],
      cat: 'brand',
      label: 'BRAND & BUSINESS · 品牌與商業',
      name: '豆豆貼｜豆皮鍋貼品牌',
      desc: '從「低負擔享受美食」的品牌主張出發，延伸出品牌視覺、行銷海報、商品樣張，以及互動式商業提案。',
      tools: ['品牌企劃', 'AI 圖像生成', 'Canva', 'Claude'],
      detail: '以千張豆皮鍋貼為核心建立「豆豆貼」品牌：經營理念是低負擔享受美食，品牌色為燕麥黃與淺咖啡，核心符號是「二頭肌鍋貼」。課堂上用 AI 撰寫 Prompt，生成品牌行銷、人才招募與「健健貼近你」盲盒活動三款海報、產品宣傳圖與文創商品，並用 Canva 把 LOGO 放到帆布袋、紙杯與紙袋上。另外用 Claude 製作了 10 頁的互動式商業提案簡報（數字皆為示意資料）。LOGO 由第四組組員生成。',
      state: '品牌視覺、海報與互動提案已完成',
      link: 'https://claude.ai/artifact/PyuTwXMkRZGZanMgGaSrTU',
      linkLabel: '開啟互動提案簡報',
      images: [
        { src: 'assets/works/brand-photo-apron.webp', alt: '豆豆貼商品宣傳圖：穿著印有 LOGO 圍裙的店員端出一盤豆皮鍋貼', caption: '商品宣傳圖（AI 圖像編修）' },
        { src: 'assets/works/brand-logo.webp', alt: '豆豆貼 LOGO：結實的手臂用筷子夾起豆皮鍋貼', caption: '品牌 LOGO（由第四組組員生成）' },
        { src: 'assets/works/brand-poster-marketing.webp', alt: '豆豆貼品牌行銷海報：好吃，也能很健康', caption: '品牌行銷海報（AI 生成）' },
        { src: 'assets/works/brand-poster-recruit.webp', alt: '豆豆貼人才招募海報：職缺、薪資與福利', caption: '人才招募海報（AI 生成）' },
        { src: 'assets/works/brand-poster-event.webp', alt: '豆豆貼「健健貼近你」盲盒活動海報', caption: '「健健貼近你」盲盒活動海報（AI 生成）' },
        { src: 'assets/works/brand-photo-table.webp', alt: '豆豆貼產品宣傳圖：由上往下拍的鍋貼、豆漿與湯品', caption: '產品宣傳圖 2（AI 圖像編修）' },
        { src: 'assets/works/brand-merch.webp', alt: '豆豆貼文創商品：角色盲盒、OK 蹦與運動毛巾', caption: '文創商品設計（AI 生成）' },
        { src: 'assets/works/brand-mock-tote.webp', alt: '印有豆豆貼 LOGO 的帆布袋', caption: '商品樣張：帆布袋' },
        { src: 'assets/works/brand-mock-cup.webp', alt: '印有豆豆貼 LOGO 的紙杯', caption: '商品樣張：紙杯' },
        { src: 'assets/works/brand-mock-bag.webp', alt: '印有豆豆貼 LOGO 的紙袋', caption: '商品樣張：紙袋' },
        { src: 'assets/works/doudoutie-01.webp', alt: '豆豆貼互動提案簡報封面', caption: '互動提案簡報封面（數字為示意資料）' },
        { src: 'assets/works/doudoutie-02.webp', alt: '豆豆貼損益平衡計算器', caption: '損益平衡計算器：拉動拉桿即時試算' },
        { src: 'assets/works/doudoutie-03.webp', alt: '豆豆貼全台展店互動地圖', caption: '全台展店互動地圖' }
      ]
    },
    {
      id: 'ux',
      units: ['10/20 第一單元｜AI 商業工作流入門'],
      cat: 'ux',
      label: 'PRODUCT & UI/UX · 產品與介面',
      name: '日日好日 Daily Bloom',
      desc: '把天氣、每日資訊、情緒、感恩與生活習慣，整合進同一個溫柔日常儀式的生活覺察 Web App。',
      tools: ['Gemini Canvas', 'UI/UX', '產品規劃', '無障礙設計'],
      detail: '用 Gemini 的 Canvas 功能完成「日日好日 Daily Bloom」的 UI／UX 網頁，並整理成 15 頁產品提案簡報。資訊架構分成「今天 → 紀錄 → 回看」三個層級；用花朵綻放（🌱 → 🌿 → 🌷 → 🌸）取代打分數，降低自我追蹤的壓力；情緒、感恩與運動都設計成一分鐘內可以完成的微紀錄。也考量了不同使用者（通勤上班族、高齡與低視力使用者、作息不固定的學生）的需求，納入大按鈕、字體調整與減少動畫等無障礙設計。',
      state: 'Gemini Canvas 網頁原型與提案簡報已完成',
      link: 'https://share.gemini.google/sYT2oVAAjmN5',
      images: [
        { src: 'assets/works/dailybloom-04.webp', alt: 'Daily Bloom 花朵進度：從幼苗到盛開', caption: '花朵不是裝飾，而是進度的語言' },
        { src: 'assets/works/dailybloom-01.webp', alt: '日日好日 Daily Bloom 提案簡報封面：讓今天，慢慢綻放', caption: '提案簡報封面' },
        { src: 'assets/works/dailybloom-02.webp', alt: 'Daily Bloom 與傳統習慣 App 的設計比較', caption: '跳脫懲罰迴圈：與傳統習慣 App 的比較' },
        { src: 'assets/works/dailybloom-03.webp', alt: 'Daily Bloom 首屏資訊架構：左欄核心覺察、右欄外部資訊', caption: '首屏資訊架構：只回答當下最重要的三件事' },
        { src: 'assets/works/dailybloom-05.webp', alt: 'Daily Bloom 微紀錄設計：情緒輪盤、三件小事、真實運動', caption: '降低認知負擔的微紀錄設計' },
        { src: 'assets/works/dailybloom-06.webp', alt: 'Daily Bloom 色彩系統與排版規範', caption: '品牌語彙：色彩系統與排版' }
      ]
    },
    {
      id: 'homework',
      units: ['課外創作實驗'],
      cat: 'ux',
      label: 'TOOL & UI/UX · 工具與介面',
      name: '青年AI實戰養成班—回家作業總表',
      desc: '把課程每天的單元與回家作業，整理成一本可以逐項勾選的線上「聯絡簿」，完成一天就蓋上紅色「完成」章。',
      tools: ['Claude', '資訊架構', 'UI/UX', '網頁工具'],
      detail: '為了掌握課程進度而做的工具。以台灣學校的聯絡簿為設計靈感：方格紙底、每天一列、完成時蓋上紅色印章。依週次整理各單元主題與每天的回家作業，功能包含：今天的作業、整體與每週完成進度、待補作業提醒、子項目勾選、重要日期倒數（個人發表、Launch Day、成果發表），以及實作提醒事項；擁有者也能直接在頁面上新增或編輯課程日。手機與電腦都能使用。',
      state: '已上線，可開啟使用',
      link: 'https://claude.ai/artifact/LZqKm48Dttu6euUq5r65gX',
      images: [
        { src: 'assets/works/homework-tracker-01.webp', alt: '回家作業總表的週次聯絡簿畫面：每天一列，有分類標籤、作業與子項目勾選框，今天以黃色標示', caption: '週次聯絡簿：每天一列，分類標籤、子項目勾選，今天以黃色標示。' },
        { src: 'assets/works/homework-tracker-02.webp', alt: '回家作業總表首頁：完成進度、待補作業、重要日期倒數與今天的作業', caption: '首頁總覽：完成進度、重要日期倒數與今天的作業。（截圖為新裝置尚未勾選的初始畫面，數字不代表實際進度）' },
        { src: 'assets/works/homework-tracker-03.webp', alt: '回家作業總表的手機版畫面', caption: '手機版畫面。' }
      ]
    }
  ],

  /* 作品分類的卡片底色 */
  categoryColors: { data: '#e8eee9', brand: '#f8ead5', ux: '#f2eee2', experiment: '#e8e8dc' },

  /* 沒有截圖時顯示的「概念示意圖」（SVG 向量圖，一般不需要修改） */
  conceptArt: {
    data: `<svg viewBox="0 0 600 250" role="img" aria-label="概念示意：試算表連到銷售網頁"><rect x="35" y="23" width="250" height="202" rx="12" fill="#fff" stroke="#bdcec3"/><path d="M35 60H285M35 92H285M35 124H285M35 156H285M35 188H285M99 60V225M178 60V225" stroke="#d4ddd4" stroke-width="3"/><rect x="35" y="23" width="250" height="37" rx="12" fill="#91aa9b"/><text x="56" y="47" fill="white" font-size="16" font-weight="bold">Google Sheets</text><path d="M306 120H351" stroke="#7e987d" stroke-width="5" stroke-linecap="round"/><path d="M340 108L356 120L340 132" fill="none" stroke="#7e987d" stroke-width="5"/><rect x="372" y="26" width="194" height="195" rx="14" fill="#fff" stroke="#b1c4b1" stroke-width="3"/><rect x="372" y="26" width="194" height="34" rx="14" fill="#4b6657"/><circle cx="391" cy="44" r="4" fill="#dbbca1"/><text x="410" y="48" font-size="15" fill="white">Sales App</text><rect x="391" y="75" width="155" height="32" rx="6" fill="#edf1eb"/><rect x="391" y="119" width="155" height="32" rx="6" fill="#edf1eb"/><rect x="391" y="166" width="155" height="33" rx="9" fill="#91aa9b"/><text x="441" y="188" fill="white" font-size="13">＋ 新增銷售</text></svg>`,
    brand: `<svg viewBox="0 0 600 250" role="img" aria-label="概念示意：豆豆貼品牌"><circle cx="175" cy="132" r="98" fill="#f2d9ab"/><ellipse cx="175" cy="155" rx="95" ry="44" fill="#f9f0d8"/><path d="M97 138Q150 70 223 130Q237 165 196 174L111 168Z" fill="#d69c58" stroke="#ae7c44" stroke-width="4"/><path d="M110 126Q151 85 210 126" fill="none" stroke="#fff0c7" stroke-width="6"/><circle cx="350" cy="90" r="28" fill="#b9c59d"/><circle cx="404" cy="158" r="17" fill="#a7b68d"/><text x="305" y="120" font-size="39" fill="#53664c" font-weight="bold">豆豆貼</text><text x="308" y="161" font-size="21" fill="#83745c">低負擔享受美食</text></svg>`,
    ux: `<svg viewBox="0 0 600 250" role="img" aria-label="概念示意：日日好日 App"><rect x="205" y="8" width="190" height="236" rx="26" fill="#faf9f2" stroke="#afbbac" stroke-width="6"/><rect x="279" y="17" width="45" height="8" rx="4" fill="#a6b4a7"/><text x="235" y="67" font-size="18" fill="#637866">日日好日 ☀</text><rect x="224" y="87" width="151" height="48" rx="11" fill="#e8ecdc"/><text x="240" y="113" font-size="15" fill="#778a72">今天感覺如何？</text><rect x="224" y="146" width="70" height="57" rx="11" fill="#f6e2cd"/><rect x="303" y="146" width="72" height="57" rx="11" fill="#e1e9df"/><text x="240" y="180" font-size="24">♡</text><text x="319" y="180" font-size="24">☘</text><circle cx="120" cy="105" r="39" fill="#dfebd6"/><text x="97" y="117" font-size="33">☀</text><circle cx="485" cy="148" r="42" fill="#f3e5ca"/><text x="468" y="160" font-size="32">✿</text></svg>`,
    experiment: `<svg viewBox="0 0 600 250" role="img" aria-label="概念示意：AI 學習實驗"><rect x="70" y="40" width="135" height="150" rx="17" fill="#e6eadf"/><text x="100" y="120" font-size="53">✦</text><rect x="234" y="21" width="135" height="180" rx="17" fill="#f3ddc9"/><text x="264" y="122" font-size="53">🎨</text><rect x="395" y="50" width="135" height="144" rx="17" fill="#d9e5db"/><text x="428" y="127" font-size="53">✎</text></svg>`
  },

  /* -------------------------------------------------------------------
     4) 合作互動（Let's Connect）
     ------------------------------------------------------------------- */

  /* ★ 表單收件網址：依 docs/表單設定教學.md 建立 Google Apps Script 後，
       把「網頁應用程式網址」（結尾是 /exec）貼在下方引號中。
       留空時，網站會提示「表單尚未啟用」，不會假裝送出成功。 */
  form: {
    endpoint: 'https://script.google.com/macros/s/AKfycbymaU_YiAkBk10-ckes334kaHvUMeri9mGgFLWI3h-w0Ox3I7ZoTudb5sbp-IMeCom5/exec'
  },

  /* 專長代碼 → 送到試算表的文字 */
  skillLabels: {
    design: 'UI/UX 與視覺設計',
    code: '程式與系統開發',
    marketing: '品牌與行銷',
    data: '資料分析',
    planning: '企劃與專案管理',
    other: '其他領域'
  },

  /* 依專長顯示的預設合作情境 */
  matches: {
    design:    ['一起打造更友善的使用體驗', '你擅長視覺與介面，我喜歡觀察需求、企劃與流程整合。或許可以一起探索 Daily Bloom。'],
    code:      ['讓想法變成可使用的產品', '從需求、資料與流程出發，與程式開發專長互補，一起讓原型更加完整。'],
    marketing: ['從品牌概念走向市場驗證', '一起研究使用者、品牌故事與行銷活動，讓好的產品更容易被看見。'],
    data:      ['用數據讓營運決策更清楚', '從資料架構、儀表板到使用者流程，一起讓數據成為有用的資訊。'],
    planning:  ['讓好點子有具體的執行方向', '一起釐清需求、規劃時程、分配工作與協調執行。'],
    other:     ['跨領域，可能就是最好的起點', '交換彼此的專長與觀點，也許就會發現還沒想到的新可能。']
  },

  /* -------------------------------------------------------------------
     5) 簡報模式（8 頁，2026/11/6 發表用，總長約 7 分鐘）
     k = 頁首小標、t = 大標題、d = 說明、extra = 三個重點、
     img = 角色圖（對應上方 images 名稱，可留空）、
     project = 顯示某個作品的截圖（填作品 id）、
     sec = 建議講述秒數（只用於講稿提示，不會自動換頁）、note = 講稿
     ------------------------------------------------------------------- */
  slides: [
    /* 順序：故事線版（2026/11/3 調整）
       自我介紹 → 學習歷程 → 作品 → 合作方式 → 未來 → 邀請交流
       簡報畫面不顯示講稿；完整逐字稿在 docs/發表文字稿.md（會輸出成 docs/發表講稿.pdf）。
       這裡的 note 只作為重點備忘，修改講稿時請同步更新文字稿。 */
    { k: 'WELCOME · 01', t: 'Hello, I’m Mindy.', d: '一位持續更新中的跨領域探索者。歡迎來到 MINDY OS。',
      extra: ['好奇心持續更新', '善於企劃與協作', '用 AI 創造更多可能'], img: 'welcome', sec: 35,
      note: '自我介紹（鐘敏恩／Mindy）→ 不只是簡報，邀請大家探索 MINDY OS → 這堂課是我最新的一次「版本更新」。' },
    { k: 'ABOUT ME · 02', t: '不同的經歷，相同的好奇心。', d: '幼兒教育、學校行政、門市營運、AI 應用。核心理念：把一個問題釐清，找到方法，再把它落地執行。',
      extra: ['釐清問題', '尋找方法', '落地執行'], img: 'introducing', sec: 60,
      note: '四個領域（含新加坡幼教 2 年、門市社群經營）→ 共同點：面對「人」和「流程」→ 核心理念：釐清、方法、落地 → 興趣：美食、旅遊、閱讀、電影、攝影、羽球。' },
    { k: 'VERSION HISTORY · 03', t: '從使用 AI，到整合 AI。', d: '以前用 AI 查資料、寫文字；現在開始結合 Prompt、試算表、資料架構和網頁原型。',
      extra: ['AI as a Tool', '→ 反覆試驗與修正', 'AI as a Partner'], img: 'thinking', sec: 60,
      note: '1.0 既有能力 → 2.0 AI 當助理 → 3.0 串起 Prompt、試算表、資料架構、網頁原型 → 關鍵：從單一任務到整體流程，AI 從工具變夥伴。' },
    { k: 'FEATURED PROJECT · 04', t: '當試算表不再只是試算表。', d: '我最有成就感的作品，是將熟悉的營運資料管理，延伸成店員可以操作的系統網頁，再一路做到排班與薪資。',
      extra: ['主檔與 BOM', '銷售與營收', '排班與薪資'], project: 'data', sec: 80,
      note: '最有成就感的作品 → 豆皮鍋貼店：主檔、BOM → 銷售、庫存、營收毛利 → Apps Script 系統網頁 → 延伸排班與薪資 → 重點：前台與後台的分工 → 連結門市經驗。' },
    { k: 'CREATIVE LAB · 05', t: '一個想法，可以有不同的實現方式。', d: '從豆豆貼的品牌視覺與互動提案，到 Daily Bloom 的產品介面，再到課程用的回家作業總表：我喜歡把學習運用在不同領域。',
      extra: ['豆豆貼品牌與提案', 'Daily Bloom 介面', '回家作業總表'], gallery: ['brand', 'ux', 'homework'], sec: 60,
      note: '豆豆貼：AI 生成海報、商品樣張，加上 Claude 互動提案（數字為示意；LOGO 由組員生成）／Daily Bloom：Gemini Canvas，用花朵綻放取代打分數／回家作業總表：可勾選的課程聯絡簿 → 不一定最完整，但都是練習的過程。' },
    { k: 'USER MANUAL · 06', t: '如何與 Mindy 合作？', d: '喜歡先釐清目標，也重視直接而尊重的交流、責任感與工作品質。',
      extra: ['先對齊目標', '尊重不同觀點', '一起把想法落地'], img: 'collaborating', sec: 50,
      note: '看完作品，這是我的使用說明書 → 四個核心功能 → 合作偏好：對齊目標、直接而尊重、分工清楚 → 更新中：排序優化、思考時間（停下來 = 系統運算中）。' },
    { k: 'ROADMAP · 07', t: '下一個版本，正在路上。', d: '持續學習 AI 應用、產品規劃與 UI/UX，期待找到不同專長的夥伴，一起探索更多可能。',
      extra: ['AI 整合', '產品與使用者體驗', '跨域共同創造'], img: 'ready', sec: 35,
      note: 'NOW 深化 AI 工作流程 → NEXT 探索 PM／UI/UX → FUTURE 和不同專長的夥伴一起創造。' },
    { k: 'LET’S CONNECT · 08', t: '整合工具，解決痛點。', d: 'AI 不光是解決問題的工具，也可以創造更多可能。帶著過去的經驗出發，讓 AI 成為延伸能力與實現想像的橋樑。',
      extra: ['互相學習', '交換想法', '歡迎交流！'], img: 'thanks', qr: 'assets/qr-connect.svg', sec: 40,
      note: '這個網站也是和 AI 一起完成的 → 請大家掃 QR code 留下名字與專長 → 結語：整合工具，解決痛點。AI 不光是解決問題的工具，也可以創造更多可能……請多多指教，歡迎交流！' }
  ],

  /* -------------------------------------------------------------------
     6) 彩蛋文字（點首頁 Mindy、種小植物時出現）
     ------------------------------------------------------------------- */
  /* 「工作之外的 Mindy」：點擊興趣卡片時，Mindy 說的話（可自由修改） */
  hobbies: {
    food: '看到好吃的，會先拍照，再默默記進腦中的「美食試算表」。評分欄位只有三種：好吃、超好吃、下次還要來。',
    travel: '出發前，行程排得像專案時程表；到了當地，卻最愛走進計畫外的小巷。好奇心，永遠比行程表快一步。',
    reading: '書櫃裡「待讀」永遠比「已讀」多。沒關係，好奇心本來就是一份持續更新中的清單。',
    movie: '看完電影，會忍不住分析角色動機和劇情結構。企劃魂一上身，連片尾彩蛋都不放過。',
    photo: '相簿裡最多的不是自拍，而是食物、天空和路邊的小花。生活裡的小美好，都想好好收藏。',
    badminton: '享受揮拍的過程、競技時的快感、追蹤球時的專注，還有身體力量的調配。羽球，是很棒的運動項目！'
  },

  mindySays: [
    '嗨！一起開啟更多可能吧！',
    '好奇心：已啟動 ☀',
    '讓想法再想深一點……',
    '要不要去 Creative Lab 逛逛？',
    '偷偷告訴你：右下角的小植物可以澆水 🌱'
  ],
  plantStages: ['🌱', '🌿', '🪴', '🌳', '🌸'],
  plantMessages: [
    '好奇心 +1！小芽冒出來了。',
    '好奇心 +1！葉子長出來了。',
    '好奇心 +1！它需要更多探索的養分。',
    '好奇心 +1！快要開花了……',
    '🎉 好奇心滿點！謝謝你發現這個小秘密！'
  ]
};
