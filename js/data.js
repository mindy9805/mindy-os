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
    fullbody:  'assets/mindy/mindy-fullbody.webp', // 全身站姿（桌機首頁）
    welcome:   'assets/mindy/pose-welcome.webp',   // 揮手打招呼（手機首頁、簡報第 1 頁）
    thinking:  'assets/mindy/pose-thinking.webp',  // 托腮思考
    exploring: 'assets/mindy/pose-exploring.webp', // 拿地圖探索
    surprise:  'assets/mindy/pose-surprise.webp'   // 驚喜摀嘴
  },

  /* -------------------------------------------------------------------
     2) 六大功能卡片（首頁探索地圖下方）
     格式：[圖示, 標題, 說明, 對應區塊 id]
     ------------------------------------------------------------------- */
  navCards: [
    ['🌿', 'About Me',        '我的故事',       'about'],
    ['📖', 'User Manual',     '合作使用說明書', 'manual'],
    ['🧪', 'Creative Lab',    'AI 作品實驗室',  'lab'],
    ['🕰️', 'Version History', '我的更新紀錄',   'history'],
    ['🧭', 'Roadmap',         '未來探索方向',   'roadmap'],
    ['🤝', "Let's Connect",   '一起創造可能',   'connect']
  ],

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
     cat 可用值：data（營運與資料）、brand（品牌創作）、ux（產品與 UI/UX）、experiment（AI 實驗）
     ------------------------------------------------------------------- */
  projects: [
    {
      id: 'data',
      cat: 'data',
      label: 'DATA & AUTOMATION',
      name: '營運資料與銷售管理系統',
      desc: '從商品主檔、BOM、銷售紀錄，到可操作的網頁表單。熟悉的試算表工作，原來還能走得更遠。',
      tools: ['Excel', 'Google Sheets', 'Apps Script', 'AI 協作'],
      detail: '以豆皮鍋貼店營運為題，規劃商品、原物料與銷售資料架構，進一步嘗試讓店員透過網頁輸入銷售資料。重點不只是公式，而是重新思考前台與後台的工作流程。',
      state: '已有可使用成果；正式截圖待放入',
      featured: true,
      images: [] // ← 在這裡放入真實截圖
    },
    {
      id: 'brand',
      cat: 'brand',
      label: 'BRAND & BUSINESS',
      name: '豆豆貼｜豆皮鍋貼品牌',
      desc: '從低負擔的品牌主張，延伸到品牌視覺、行銷文案、短影音及商品創意。',
      tools: ['品牌企劃', 'AI 圖像', '短影音腳本', '行銷提案'],
      detail: '以豆皮鍋貼為核心建立「豆豆貼」品牌概念，探索如何將定位與消費者感受轉換成視覺內容及行銷提案。',
      state: '作品素材待放入',
      images: []
    },
    {
      id: 'ux',
      cat: 'ux',
      label: 'PRODUCT & UI/UX',
      name: '日日好日 Daily Bloom',
      desc: '以晨間儀式與日常覺察為題，整合情緒、感恩、天氣及生活紀錄的產品構想。',
      tools: ['需求規劃', 'UI/UX', '產品原型', 'AI 輔助'],
      detail: '從個人生活情境出發，設計能夠記錄情緒、感恩與日常成長的使用介面，練習從功能想法走向產品結構。',
      state: '介面素材待放入',
      images: []
    },
    {
      id: 'experiment',
      cat: 'experiment',
      label: 'AI EXPERIMENTS',
      name: '課堂創作實驗室',
      desc: '探索 Prompt、AI 工作流程、圖像生成、簡報與其他課堂成果。',
      tools: ['Prompt', 'AI Workflow', '視覺生成'],
      detail: '課程期間透過不同題型及實作，練習把想法描述清楚、檢查生成結果、反覆修改與優化。',
      state: '其他作品待放入',
      images: []
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
     4) 合作互動（Let's Connect）：依專長顯示的預設合作情境
     ------------------------------------------------------------------- */
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
    { k: 'WELCOME · 01', t: 'Hello, I’m Mindy.', d: '一位持續更新中的跨領域探索者。歡迎來到 MINDY OS。',
      extra: ['好奇心持續更新', '善於企劃與協作', '用 AI 創造更多可能'], img: 'welcome', sec: 40,
      note: '大家好，我是鐘敏恩。今天不只有一份簡報，而是邀請你們探索我的個人作業系統 MINDY OS。' },
    { k: 'ABOUT ME · 02', t: '不同的經歷，相同的好奇心。', d: '教育、學校行政、門市營運——看似不同的工作，讓我練習理解需求、規劃流程與整合團隊。',
      extra: ['需求觀察', '企劃執行', '跨域整合'], img: 'fullbody', sec: 50,
      note: '我的背景不在資訊領域，但過去的教育、行政和營運工作，讓我很常碰到流程和人的需求問題。' },
    { k: 'USER MANUAL · 03', t: '如何與 Mindy 合作？', d: '喜歡先釐清目標，也重視直接而尊重的交流、責任感與工作品質。',
      extra: ['先對齊目標', '尊重不同觀點', '一起把想法落地'], img: 'thinking', sec: 50,
      note: '如果把我當成一個產品，我的核心功能是觀察、規劃、整合和實作。合作時希望大家都能清楚、坦誠地交流。' },
    { k: 'VERSION HISTORY · 04', t: '從使用 AI，到整合 AI。', d: '以前用 AI 查資料、寫文字；現在開始結合 Prompt、試算表、資料架構和網頁原型。',
      extra: ['AI as a Tool', '→ 反覆試驗與修正', 'AI as a Partner'], img: 'exploring', sec: 60,
      note: '這堂課最改變我的，是看見 AI 不只能處理眼前任務，也能幫助我們把不同工具串在一起。' },
    { k: 'FEATURED PROJECT · 05', t: '當試算表不再只是試算表。', d: '我最有成就感的作品，是將熟悉的營運資料管理，延伸成可以操作的銷售輸入網頁。',
      extra: ['商品與原物料主檔', '銷售紀錄與資料統計', '網頁表單操作'], project: 'data', sec: 80,
      note: '原來 AI 可以協助我從 Excel 出發，進一步建立操作介面。這件事讓我對產品和系統設計有新的想像。' },
    { k: 'CREATIVE LAB · 06', t: '一個想法，可以有不同的實現方式。', d: '豆豆貼品牌、Daily Bloom、課堂 AI 實驗：從品牌創意到日常產品，我喜歡把學習運用在不同領域。',
      extra: ['豆豆貼｜品牌設計', 'Daily Bloom｜UI/UX', 'AI 課堂創作'], gallery: ['brand', 'ux', 'experiment'], sec: 60,
      note: '這些作品不一定都最完整，但每一項都是我練習拆解需求、調整提示詞與跨域整合的過程。' },
    { k: 'ROADMAP · 07', t: '下一個版本，正在路上。', d: '持續學習 AI 應用、產品規劃與 UI/UX，期待找到不同專長的夥伴，一起探索更多可能。',
      extra: ['AI 整合', '產品與使用者體驗', '跨域共同創造'], img: 'exploring', sec: 40,
      note: '我希望持續把自己原本的企劃與觀察優勢，和新的工具結合，也想認識不同專長的朋友。' },
    { k: 'LET’S CONNECT · 08', t: '一起創造更多可能。', d: 'AI 不光是解決問題的工具，也可以創造更多可能。帶著過去的經驗出發，讓 AI 成為延伸能力與實現想像的橋樑。',
      extra: ['互相學習', '交換想法', '歡迎交流！'], img: 'surprise', sec: 40,
      note: '最後，希望這不只是我的成果發表，也是和大家交流的開始。「AI 不光是解決問題的工具，也可以創造更多可能。希望能帶著過去的經驗出發，讓 AI 成為延伸能力與實現想像的橋樑。請多多指教，歡迎交流！」' }
  ],

  /* -------------------------------------------------------------------
     6) 彩蛋文字（點首頁 Mindy、種小植物時出現）
     ------------------------------------------------------------------- */
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
