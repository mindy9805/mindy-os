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
     3) 作品卡片（Creative Lab）— 依課堂日期排列，最後是課外創作實驗
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
      id: 'data',
      units: ['10/29 第六單元｜營運資料架構', '11/02 第七單元｜智慧營運試算表'],
      links: [
        { label: '開啟原物料主檔系統', system: true, url: 'https://script.google.com/macros/s/AKfycbzRgW0gFZQSQYfbcTmY81GVTOl1rtqIyFBEGjYABMOclb8mo25ySs24zFU6JIukYDTwDQ/exec' },
        { label: '開啟排班薪資系統', system: true, url: 'https://script.google.com/macros/s/AKfycbw4cxtMCMJGr2gsBFFyOP6DejkZ8r1pwxZcmGJRLo7iX7AMJYuUt26u_WztOzeqWq7b/exec' }
      ],
      cat: 'data',
      label: 'DATA & AUTOMATION · 營運與資料',
      name: '營運資料與銷售管理系統',
      desc: '從商品與原物料主檔、配方 BOM，到銷售、庫存與營收毛利，再延伸出排班與薪資系統。熟悉的試算表工作，原來還能走得更遠。',
      tools: ['Excel', 'Google Sheets', 'Apps Script', 'AI 協作'],
      detail: '以豆皮鍋貼店營運為題，先規劃商品、原物料、供應商主檔與配方 BOM，再串起銷售紀錄、進貨、商品成本、庫存管理與營收毛利，並用 Apps Script 做成店員可以操作的系統網頁。之後延伸出排班與薪資系統：從薪資設定、排班、休假申請、加班與工時彙總，一路算到薪資明細。重點不只是公式，而是重新思考前台與後台的工作流程。',
      state: '試算表與系統網頁已完成',
      featured: true,
      highlight: '學習突破：從試算表，到 GAS 操作網頁', // 主打作品卡片上的重點句
      images: [
        { src: 'assets/works/sheet-master.webp', alt: '豆豆貼鍋貼商品原物料供應商主檔試算表：設定選單、商品主檔、供應商主檔、原物料主檔、商品配方 BOM、銷售紀錄、進貨紀錄、商品成本、庫存管理、營收毛利等工作表', caption: '豆豆貼鍋貼 商品原物料供應商主檔：從設定選單、商品與原物料主檔、配方 BOM，到銷售、進貨、成本、庫存與營收毛利。' },
        { src: 'assets/works/sheet-payroll.webp', alt: '排班和薪資試算表：薪資設定與費率參數，包含獎金、加班費率、勞健保自付額與請假扣薪規則', caption: '排班和薪資：薪資設定、排班、休假申請、加班與工時彙總，一路算到薪資明細。' }
      ] // ← 在這裡放入真實截圖
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
  /* ★ 安全開關：作品中的 Apps Script「系統網址」（system: true）是公開網頁，
       任何拿到網址的人都能開啟、甚至操作試算表資料。
       發表前請用無痕視窗打開確認：畫面上沒有真實姓名、薪資、電話等資料，
       也不能被陌生人改壞。若不確定，把下面改成 false，網站就不會顯示這兩個按鈕。 */
  showSystemLinks: true,

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
     t、d 的排版小技巧：\n 換行、\n\n 分段、[[文字]] 用強調色標示
     ------------------------------------------------------------------- */
  /* 網站導覽的時間（秒）：簡報最後一頁按「開始瀏覽網站」後，可選擇是否帶大家快速看網站 */
  tourSec: 0, // 網站導覽改為「時間允許」的選擇性收尾，不計入建議時間

  slides: [
    /* ★ 簡報：9 頁「濃縮重點版」（不加外框），合計 380 秒＝6 分 20 秒，保留現場操作緩衝（規定最長 8 分鐘）。
       口頭介紹以「問題 → 方法 → 結果 → 收穫」為核心；完整逐字稿在 docs/發表文字稿.md（輸出為 docs/發表講稿.pdf）。
       修改方式：直接改文字即可；layout 是版型名稱，side 是右側會動的角色圖（版面有空位才放）。 */
    { k: 'WELCOME · 01', layout: 'hero', sec: 30,
      t: 'Hello,\nI\'m Mindy.', lead: '一個持續更新中的跨領域探索者',
      tags: ['好奇', '企劃', '跨域', '創造'], img: 'welcome',
      foot: '今天的簡報，就是我的個人網站 MINDY OS',
      note: '自我介紹；今天的簡報就是我的網站。' },
    { k: 'ABOUT ME · 02', layout: 'domains', side: 'introducing', flip: true, sec: 55,
      t: '不同的經歷，相同的好奇心',
      items: [
        { icon: '🧸', name: '幼兒教育', line: '新加坡幼兒華語教師、教保員' },
        { icon: '🏫', name: '學校行政', line: '實驗教育機構行政教師' },
        { icon: '🏪', name: '門市營運', line: '店長，社群從 0 到 1' },
        { icon: '🤖', name: 'AI 應用', line: '青年 AI 實戰養成班' }
      ],
      story: { label: '一個小故事', text: '人工點名和請假統計很花時間 → 重新設計流程：學生自主點名，教師更方便管理資料' },
      foot: '我喜歡從觀察需求開始，一步步改善工作方式',
      note: '四個領域；學校出勤系統小故事（問題→方法→收穫）。' },
    { k: 'ABOUT ME · 03', layout: 'flow', side: 'thinking', flip: true, sec: 20,
      t: '核心理念',
      items: [
        { name: '釐清問題', en: 'Clarify', color: '#c99a78' },
        { name: '尋找方法', en: 'Method', color: '#8fa383' },
        { name: '落地執行', en: 'Execute', color: '#343b35' }
      ],
      foot: '參加動機：用 AI 解決實際工作問題 × 轉型 PM、數位行銷、營運企劃',
      note: '核心理念；參加動機。' },
    { k: 'CREATIVE LAB · 04', layout: 'works', sec: 35,
      t: '一個想法，可以有不同的實現方式',
      items: [
        { date: '10/20', name: '日日好日 Daily Bloom', line: 'Gemini Canvas｜用花朵綻放取代打分數', img: 'assets/works/dailybloom-04.webp' },
        { date: '10/21–22', name: '豆豆貼 品牌與提案', line: 'Claude 互動提案＋AI 品牌視覺', img: 'assets/works/brand-photo-apron.webp' }
      ],
      foot: '※ 提案中的數字為示意資料；豆豆貼 LOGO 由組員生成',
      note: '依上課日期介紹；提醒數字為示意、LOGO 由組員生成。' },
    { k: 'FEATURED PROJECT · 05', layout: 'featured', sec: 80,
      t: '從試算表，到 GAS 操作網頁', tag: '★ 主打作品｜營運資料與銷售管理系統｜10/29–11/02',
      items: [
        { name: '設計資料架構', line: '商品、原物料、供應商主檔＋配方 BOM', img: 'assets/works/sheet-master.webp' },
        { name: '做成 GAS 操作網頁', line: '用 Google Apps Script，讓店員直接輸入與查詢', icon: '🖥️', imgNote: '現場可開啟系統示範' },
        { name: '延伸排班薪資', line: '排班、休假、加班 → 自動算出薪資明細', img: 'assets/works/sheet-payroll.webp' }
      ],
      breakthrough: '不再只是「基礎操作」，而是開始設計資料，也思考前台的人要怎麼操作。這正好連結到我過去在門市營運和學校出勤系統的經驗。',
      note: '問題→方法→結果→收穫；從試算表到 GAS 操作網頁。' },
    { k: 'VERSION HISTORY · 06', layout: 'compare', side: 'presenting', flip: true, sec: 45,
      t: '最大的學習收穫',
      items: [
        { label: 'BEFORE · 以前', name: 'AI 是工具', line: '查資料、潤飾文字，完成單一任務' },
        { label: 'AFTER · v3.0 現在', name: 'AI 是夥伴', line: '串起 Prompt、試算表、資料架構與網頁原型' }
      ],
      story: { label: 'v3.0 學習轉折', text: '以前請 AI 幫忙找答案；現在練習把需求說清楚、持續修正結果，也用 AI 協助找出程式問題' },
      foot: '從「完成單一任務」，到「思考整體流程」',
      note: '前後對照；學習轉折（學習方法）。' },
    { k: 'ROADMAP · 07', layout: 'profile', side: 'ready', sec: 30,
      t: '我的 AI 小檔案',
      items: [
        { label: '最有信心的操作', name: '試算表資料架構', line: '以及用 AI 做互動網頁與簡報' },
        { label: '最喜歡的應用', name: '把想法變成產品', line: '從需求一步步做出能用的東西' },
        { label: '接下來想深入', name: 'AI 工作流程', line: 'PM 與 UI/UX 產品規劃' }
      ],
      note: '最有信心、最喜歡的應用、研究方向。' },
    { k: 'USER MANUAL · 08', layout: 'manual', side: 'collaborating', sec: 20,
      t: '如何與 Mindy 合作？',
      items: [
        { icon: '🎯', name: '需求洞察' }, { icon: '🗓️', name: '企劃整合' },
        { icon: '💬', name: '協作溝通' }, { icon: '💡', name: '創意實作' }
      ],
      foot: '先對齊目標・歡迎直接而尊重的討論',
      note: '四個核心功能；合作偏好。' },
    { k: 'LET’S CONNECT · 09', layout: 'connect', sec: 65,
      t: '一起探索，一起創造', img: 'thanks', qr: 'assets/qr-connect.svg',
      topic: '用 AI 架設個人網站', topicLine: '讓每個人的經歷與作品都能被看見',
      roles: '我願意擔任發想與執行者，也樂意擔任合作與支持者。',
      invite: '歡迎不同領域的朋友交流合作！',
      thanks: '請多多指教，謝謝大家 ♡',
      note: '想做的題目與角色；結尾串起：從哪裡出發、AI 帶來的改變、想與誰一起走下去。' }
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
