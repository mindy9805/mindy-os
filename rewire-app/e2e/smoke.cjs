/**
 * 端對端冒煙測試（Playwright）
 * 執行前先 `npm run build && npx vite preview --port 4173`，再執行：node e2e/smoke.cjs
 * 會逐一檢查主要互動是否真的可用、LocalStorage 是否保存、手機版是否沒有橫向捲動。
 */
const { chromium, devices } = require('playwright');
const BASE = process.env.BASE_URL || 'http://localhost:4173/';
const results = [];
const ok = (name) => { results.push(['✓', name]); };
const fail = (name, e) => { results.push(['✗', `${name} — ${e.message.split('\n')[0]}`]); };
async function step(name, fn) { try { await fn(); ok(name); } catch (e) { fail(name, e); } }
const store = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('rewire:v1') || '{}'));
const AFF = ['我現在是安全的', '我的大腦可以改變', '我已經足夠好了', '犯錯是我成長的方式', '我的想法不等於事實', '我的存在很重要', '今天是新的機會'];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource/.test(m.text()) && errors.push(m.text()));
  page.on('dialog', (d) => d.accept());

  await step('首頁載入與標題', async () => {
    await page.goto(BASE);
    await page.getByRole('heading', { name: 'Rewire｜重塑大腦的可能' }).waitFor();
  });
  await step('Daily Rewire 七句原文與順序完全一致', async () => {
    const texts = await page.locator('#daily-title').locator('..').locator('article h3').allTextContents();
    if (JSON.stringify(texts) !== JSON.stringify(AFF)) throw new Error(JSON.stringify(texts));
  });
  await step('語句卡片展開、收藏、複製', async () => {
    const card = page.locator('article').filter({ hasText: '我的想法不等於事實' }).first();
    await card.getByRole('button', { name: '反思與行動' }).click();
    await card.getByText('今天有哪些讓我感到焦慮的想法').waitFor();
    await card.getByRole('button', { name: /收藏「我的想法不等於事實」/ }).click();
    if (!(await store(page)).dailyFavorites.includes(5)) throw new Error('未收藏');
    await card.getByRole('button', { name: /複製「我的想法不等於事實」/ }).click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    if (clip !== '我的想法不等於事實') throw new Error(clip);
    await page.getByRole('button', { name: '複製全部七句' }).first().click();
    const all = await page.evaluate(() => navigator.clipboard.readText());
    if (!AFF.every((a) => all.includes(a))) throw new Error('複製全部缺句');
  });
  await step('朗讀模式：下一句／上一句／重新開始／進度', async () => {
    await page.getByRole('link', { name: '開始今日練習' }).first().click();
    await page.getByText('1／7').waitFor();
    await page.getByRole('button', { name: '下一句' }).click();
    await page.getByRole('button', { name: '下一句' }).click();
    await page.getByText('3／7').waitFor();
    await page.getByRole('heading', { name: '我已經足夠好了' }).waitFor();
    await page.getByRole('button', { name: '上一句' }).click();
    await page.getByText('2／7').waitFor();
    await page.getByRole('button', { name: '重新開始' }).click();
    await page.getByText('1／7').waitFor();
    await page.keyboard.press('ArrowRight');
    await page.getByText('2／7').waitFor();
  });
  await step('朗讀完成 → 今日反思表單 → 儲存', async () => {
    for (let i = 0; i < 5; i++) await page.getByRole('button', { name: '下一句' }).click();
    await page.getByRole('button', { name: '完成' }).click();
    await page.getByText('今天的七句話完成了').waitFor();
    // 寫入 LocalStorage 在 React effect 中進行，稍等寫入完成
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('rewire:v1') || '{}').dailyLogs?.[0]?.completedReading === true, null, { timeout: 3000 });
    let s;
    await page.getByLabel('我的想法不等於事實').check();
    await page.getByLabel('為什麼這句話對我有意義？').fill('提醒我先看事實');
    await page.getByLabel('今天準備採取什麼小行動？').fill('寫下三個事實');
    await page.getByRole('button', { name: /還不錯/ }).click();
    await page.getByRole('button', { name: '儲存今日練習' }).click();
    s = await store(page);
    const l = s.dailyLogs[0];
    if (l.favoriteId !== 5 || l.mood !== 4 || l.why !== '提醒我先看事實' || !l.completedReading) throw new Error(JSON.stringify(l));
    await page.getByRole('button', { name: '結束練習' }).click();
    await page.waitForURL(/#\/daily$/);
  });
  await step('Daily 頁：紀錄回顧、編輯、最常選擇語句', async () => {
    await page.getByText('「我的想法不等於事實」（1 次）').waitFor();
    await page.getByRole('button', { name: /^編輯 .* 的紀錄$/ }).first().click();
    const edit = page.locator('li').filter({ has: page.getByRole('button', { name: /^刪除 .* 的紀錄$/ }) }).first();
    await edit.getByLabel('今天準備採取什麼小行動？').fill('散步五分鐘');
    await edit.getByRole('button', { name: '儲存今日練習' }).click();
    if ((await store(page)).dailyLogs[0].action !== '散步五分鐘') throw new Error('編輯失敗');
  });
  await step('章節頁：神經道路模擬器、收藏段落、反思', async () => {
    await page.goto(BASE + '#/learn/ch1');
    await page.getByRole('heading', { name: '神經可塑性的底層原理', level: 1 }).waitFor();
    for (let i = 0; i < 3; i++) await page.getByRole('button', { name: '執行一次新習慣' }).click();
    if ((await store(page)).neuralReps !== 3) throw new Error('reps');
    await page.getByText('概念示意動畫').waitFor();
    await page.getByRole('button', { name: /收藏「3\. Hebbian Learning/ }).click();
    await page.getByLabel('寫下你的反思').fill('我想少走滑手機大道');
    await page.getByRole('button', { name: '儲存反思' }).click();
    const notes = (await store(page)).notes;
    if (notes.length !== 2) throw new Error(`notes=${notes.length}`);
  });
  await step('章節測驗作答、評分、重新作答', async () => {
    const quiz = page.locator('#quiz');
    for (const q of await quiz.locator('fieldset').all()) await q.locator('input[type=radio]').nth(1).check();
    await quiz.getByRole('button', { name: '送出答案' }).click();
    await quiz.getByText(/得分：4\/4/).waitFor();
    const s = await store(page);
    if (s.quizzes.ch1.score !== 4) throw new Error('score');
    await quiz.getByRole('button', { name: '重新作答' }).click();
    await quiz.getByRole('button', { name: '送出答案' }).waitFor();
  });
  await step('標記章節完成並在側欄顯示', async () => {
    await page.getByRole('button', { name: '標記本章為已完成' }).click();
    if (!(await store(page)).chapters.ch1.completed) throw new Error('未完成');
    await page.locator('aside').first().getByLabel('已完成').first().waitFor();
  });
  await step('章節底部顯示對應心智語句', async () => {
    await page.locator('#daily').getByText('我的大腦可以改變').first().waitFor();
  });
  await step('所有 9 章節頁面可開啟且內容完整', async () => {
    for (let i = 1; i <= 9; i++) {
      await page.goto(BASE + `#/learn/ch${i}`);
      for (const h of ['學習目標', '核心概念', '深入解釋', '生活案例', '實際應用方式', '反思問題', '本章重點摘要', '研究來源', '對應的每日心智語句']) {
        await page.getByRole('heading', { name: h, exact: false }).first().waitFor({ timeout: 3000 });
      }
      const qs = await page.locator('#quiz fieldset').count();
      if (qs < 3 || qs > 5) throw new Error(`ch${i} quiz=${qs}`);
      await page.locator('figure svg[role=img]').first().waitFor();
    }
  });
  await step('第 2 章認知濾鏡：選擇解讀並存入筆記', async () => {
    await page.goto(BASE + '#/learn/ch2');
    await page.getByRole('button', { name: /他可能在忙/ }).click();
    await page.getByText('後來發現他當時戴著耳機').waitFor();
    await page.getByLabel('我觀察到哪些客觀事實？').fill('他沒有回應');
    await page.getByRole('button', { name: '存入筆記' }).click();
  });
  await step('第 3 章身份敘事改寫器（本地規則）', async () => {
    await page.goto(BASE + '#/learn/ch3');
    await page.getByLabel('3. 具體來說，你想學會的技能是？').fill('如何主動開啟並延續對話');
    await page.getByRole('button', { name: '產生改寫建議' }).click();
    await page.getByText('我正在學習如何主動開啟並延續對話。').first().waitFor();
    await page.getByRole('button', { name: '儲存改寫' }).click();
    if ((await store(page)).identityRewrites.length !== 1) throw new Error('未儲存');
  });
  await step('第 4 章自我對話五步驟', async () => {
    await page.goto(BASE + '#/learn/ch4');
    await page.getByLabel('寫下一個讓你不舒服的負面想法').fill('我每次都搞砸，大家一定覺得我很沒用');
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByText('規則偵測到').waitFor();
    for (let i = 0; i < 5; i++) await page.getByRole('button', { name: /下一步|查看整理/ }).click();
    await page.getByRole('button', { name: '儲存練習' }).click();
    if ((await store(page)).selfTalk.length !== 1) throw new Error('未儲存');
  });
  await step('第 5 章習慣偵探：新增、編輯、刪除（確認視窗）', async () => {
    await page.goto(BASE + '#/learn/ch5');
    await page.getByLabel('我做了什麼？').fill('睡前滑手機');
    await page.getByLabel('觸發提示').fill('躺上床');
    await page.getByRole('button', { name: '新增紀錄' }).click();
    await page.getByRole('button', { name: '編輯這筆紀錄' }).click();
    await page.getByLabel('我做了什麼？').fill('睡前滑手機 40 分鐘');
    await page.getByRole('button', { name: '儲存修改' }).click();
    if ((await store(page)).habitLogs[0].behavior !== '睡前滑手機 40 分鐘') throw new Error('編輯');
    await page.getByRole('button', { name: '刪除這筆紀錄' }).click();
    await page.getByRole('dialog').getByRole('button', { name: '刪除' }).click();
    if ((await store(page)).habitLogs.length !== 0) throw new Error('刪除');
    await page.getByLabel('我做了什麼？').fill('下午吃零食');
    await page.getByRole('button', { name: '新增紀錄' }).click();
  });
  await step('第 6 章習慣模擬器標註概念模型', async () => {
    await page.goto(BASE + '#/learn/ch6');
    await page.getByText('【概念模型】假設性的自動化程度曲線').waitFor();
    await page.getByLabel('習慣難度').selectOption('hard');
    await page.locator('.recharts-line').first().waitFor();
  });
  await step('第 7 章七張工具卡：呼吸、情緒命名、口袋句、睡眠、微行動、預演、暫停', async () => {
    await page.goto(BASE + '#/learn/ch7');
    const open = (n) => page.getByRole('button', { name: new RegExp(`^Tool \\d · .*${n}`) }).click();
    await open('生理性嘆息');
    await page.getByRole('button', { name: '開始練習' }).click();
    await page.waitForTimeout(11500);
    await page.getByRole('button', { name: '結束' }).click();
    if ((await store(page)).sessions.length !== 1) throw new Error('呼吸未記錄');
    await open('情緒命名');
    await page.getByRole('button', { name: '害怕', exact: true }).click();
    await page.getByRole('button', { name: '緊張', exact: true }).click();
    await page.getByRole('button', { name: '儲存情緒紀錄' }).click();
    if ((await store(page)).emotionLogs[0].word !== '緊張') throw new Error('情緒');
    await open('刺激與反應之間的空間');
    await page.getByRole('button', { name: /先放下手機/ }).click();
    await page.getByText('你在暫停後覺察了身體與情緒').waitFor();
    await open('完整心智預演');
    await page.getByLabel('要預演的情境').fill('向主管提出需求');
    await page.getByRole('button', { name: '儲存預演' }).click();
    await open('微小行動');
    await page.getByLabel('大目標').fill('完成報告');
    await page.getByLabel('第 1 步').fill('打開檔案');
    await page.getByRole('button', { name: '建立清單' }).click();
    await page.getByLabel('打開檔案').check();
    if (!(await store(page)).smallSteps[0].steps[0].done) throw new Error('勾選');
    await open('口袋句');
    await page.getByRole('button', { name: /複製句子：這個問題我想好好想一下/ }).click();
    await open('睡眠與記憶鞏固');
    await page.getByRole('button', { name: '儲存紀錄' }).click();
    if ((await store(page)).sleepLogs.length !== 1) throw new Error('睡眠');
    await page.getByText('不是醫療診斷工具').first().waitFor();
  });
  await step('第 8 章 If-Then：建立、複製、編輯', async () => {
    await page.goto(BASE + '#/learn/ch8');
    await page.getByLabel(/我的目標/).fill('每週運動三次');
    await page.getByLabel(/可能出現的情境/).fill('週一晚上吃完飯');
    await page.getByLabel(/準備執行的行動/).fill('走路 20 分鐘');
    await page.getByRole('button', { name: '儲存計畫' }).click();
    await page.getByRole('button', { name: '編輯這份計畫' }).click();
    await page.getByLabel('備用方案', { exact: true }).fill('在家伸展');
    await page.getByRole('button', { name: '儲存修改' }).click();
    if ((await store(page)).plans[0].backup !== '在家伸展') throw new Error('編輯');
  });
  await step('第 9 章證據檢視卡含 DOI 連結', async () => {
    await page.goto(BASE + '#/learn/ch9');
    await page.locator('a[href^="https://doi.org/"]').first().waitFor();
    await page.getByText('可能過度簡化的說法').first().waitFor();
  });
  await step('打破慣性：首頁焦點卡片（選 1–3 項）', async () => {
    await page.goto(BASE + '#/');
    await page.getByRole('heading', { name: '你最想調整哪一個習慣？' }).waitFor();
    for (const n of ['過度尋求認可', '反覆違背承諾', '缺少獨處思考', '過度依賴便利']) await page.getByRole('button', { name: `選擇「${n}」` }).click();
    const f = (await store(page)).patternFocus;
    if (JSON.stringify(f) !== JSON.stringify(['approval', 'promises', 'solitude'])) throw new Error('焦點：' + JSON.stringify(f));
    await page.getByText('每個微小的選擇，都在塑造未來的自己。').first().waitFor();
    await page.goto(BASE + '#/habits');
    await page.waitForURL(/#\/pattern$/);
  });
  await step('打破慣性：七個學習頁都有 10 個段落與互動工具', async () => {
    for (const id of ['approval', 'convenience', 'impress', 'solitude', 'promises', 'environment', 'shortterm']) {
      await page.goto(BASE + `#/pattern/${id}`);
      for (const h of ['行為定義', '常見生活情境', '可能的心理機制', '可能產生的長期影響', '健康行為與過度行為的界線', '與神經可塑性的關聯', '可執行的替代行動', '自我反思問題', '行動實驗', '研究證據與適用限制']) {
        await page.getByRole('heading', { name: h }).first().waitFor({ timeout: 3000 });
      }
      await page.locator('#tool').waitFor();
      await page.locator('a[href^="https://doi.org/"]').first().waitFor();
    }
  });
  await step('Habit 01 認可依賴覺察器：儲存後顯示心智語句並可設為今日練習句', async () => {
    await page.goto(BASE + '#/pattern/approval');
    await page.getByLabel('最近的一個決策').fill('答應週末代班');
    await page.getByLabel('1. 我原本真正想做什麼？').fill('休息');
    await page.getByRole('button', { name: '儲存覺察紀錄' }).click();
    await page.getByText('練習完成！帶著這句話繼續今天').waitFor();
    await page.getByRole('button', { name: '設為今日練習句' }).first().click();
    const s = await store(page);
    if (s.patternEntries[0].kind !== 'validation') throw new Error('未儲存');
    const today = s.dailyLogs.find((l) => l.practiceId === 3);
    if (!today || today.why !== '提醒我先看事實') throw new Error('今日練習句覆蓋了紀錄 ' + JSON.stringify(s.dailyLogs));
    await page.getByLabel('完成實驗後，記錄你的觀察與結果').fill('第三天開始比較敢說不');
    await page.getByRole('button', { name: '記錄完成的行動實驗' }).click();
    if ((await store(page)).counterChoices.length !== 1) throw new Error('實驗');
  });
  await step('Habit 02 舒適圈探索地圖：建立、新增、調整難度、勾選', async () => {
    await page.goto(BASE + '#/pattern/convenience');
    await page.getByLabel('一件想嘗試、但一直逃避的事').fill('開始學游泳');
    await page.getByRole('button', { name: '建立探索地圖' }).click();
    await page.getByLabel('新增步驟').first().fill('查詢附近泳池');
    await page.getByRole('button', { name: '加入步驟' }).first().click();
    await page.getByRole('button', { name: '調整為較困難的階段' }).first().click();
    await page.getByLabel('完成：查詢附近泳池').check();
    const m = (await store(page)).patternEntries.find((e) => e.kind === 'comfort');
    if (m.steps.length !== 4 || !m.steps.find((x) => x.text === '查詢附近泳池').done || m.steps[0].level !== 2) throw new Error(JSON.stringify(m.steps));
  });
  await step('Habit 03 消費動機檢視器：反思結果、冷靜期、決定', async () => {
    await page.goto(BASE + '#/pattern/impress');
    await page.getByLabel('想購買的物品').fill('新款耳機');
    await page.getByLabel('預估價格（元）').fill('3600');
    await page.getByLabel('預估每月使用次數').fill('20');
    await page.getByRole('button', { name: '想被看見或留下好印象' }).click();
    await page.getByRole('button', { name: '產生反思結果' }).click();
    await page.getByText('每次使用成本約 15 元').waitFor();
    await page.getByLabel('自訂冷靜期').selectOption('7');
    await page.getByRole('button', { name: '儲存檢視紀錄' }).click();
    await page.getByText('冷靜期中').waitFor();
    await page.getByRole('button', { name: '決定不買' }).click();
    const e = (await store(page)).patternEntries.find((x) => x.kind === 'spending');
    if (e.decision !== 'skipped' || e.coolingDays !== 7) throw new Error(JSON.stringify(e));
  });
  await step('Habit 04 安靜五分鐘：自訂時間、關閉動畫、反思儲存', async () => {
    await page.goto(BASE + '#/pattern/solitude');
    await page.getByLabel('練習時間（分鐘）').fill('1');
    await page.getByLabel('顯示呼吸動畫').uncheck();
    await page.getByRole('button', { name: '開始安靜' }).click();
    await page.waitForTimeout(2200);
    await page.getByRole('button', { name: '結束並反思' }).click();
    await page.getByLabel('我現在真正需要什麼？').fill('早點睡');
    await page.getByRole('button', { name: '儲存這次安靜練習' }).click();
    const q = (await store(page)).patternEntries.find((x) => x.kind === 'quiet');
    if (!q || q.seconds < 1 || q.need !== '早點睡') throw new Error(JSON.stringify(q));
  });
  await step('Habit 05 微承諾追蹤器：建立、完成、中斷原因、暫停、七天回顧', async () => {
    await page.goto(BASE + '#/pattern/promises');
    await page.getByLabel(/每日微承諾/).fill('早餐後閱讀兩頁書。');
    await page.getByLabel('具體執行情境').fill('吃完早餐');
    await page.getByLabel('備用方案').fill('只讀一段');
    await page.getByRole('button', { name: '建立微承諾' }).click();
    await page.getByRole('button', { name: '今天完成了' }).click();
    if ((await store(page)).commitmentLogs[0]?.status !== 'done') throw new Error('完成');
    await page.getByRole('button', { name: '記錄中斷原因' }).click();
    await page.getByLabel('中斷原因').fill('加班');
    await page.getByRole('button', { name: '儲存', exact: true }).click();
    const logs = (await store(page)).commitmentLogs;
    if (logs.length !== 1 || logs[0].status !== 'missed' || logs[0].reason !== '加班') throw new Error('同日應只有一筆 ' + JSON.stringify(logs));
    await page.getByRole('button', { name: '今天完成了' }).click();
    await page.getByLabel('最近七天執行情況').waitFor();
    await page.getByRole('button', { name: '暫停這個微承諾' }).click();
    if ((await store(page)).microCommitments[0].active) throw new Error('暫停');
    await page.getByRole('button', { name: '恢復這個微承諾' }).click();
  });
  await step('Habit 06 成長環境盤點：反思為主、不替使用者決定', async () => {
    await page.goto(BASE + '#/pattern/environment');
    await page.getByLabel('想盤點的環境或關係（可用代稱）').fill('工作團隊');
    const sets = await page.locator('#tool fieldset').all();
    const picks = ['非常符合', '大致符合', '不太符合', '大致符合', '一半一半', '非常不符合'];
    for (let i = 0; i < 6; i++) await sets[i].getByRole('button', { name: picks[i], exact: true }).click();
    await page.getByText('不會替你決定是否調整或結束任何關係').waitFor();
    await page.getByRole('button', { name: '儲存盤點' }).click();
    if (!(await store(page)).patternEntries.some((x) => x.kind === 'environment' && x.label === '工作團隊')) throw new Error('未儲存');
  });
  await step('Habit 07 短期與長期選擇模擬器：比較表', async () => {
    await page.goto(BASE + '#/pattern/shortterm');
    await page.getByLabel('當下想做的事').fill('繼續看影片一小時');
    await page.getByLabel('長期希望達成的目標').fill('每天睡滿 7 小時');
    await page.getByLabel('是否有折衷方案？').fill('先完成睡前準備再看一集');
    await page.getByRole('button', { name: '產生比較表' }).click();
    if ((await page.locator('table tbody tr').count()) !== 3) throw new Error('比較表');
    await page.getByRole('button', { name: '儲存這次比較' }).click();
  });
  await step('21 題自我評估：作答、優先項目、結果與建議工具', async () => {
    await page.goto(BASE + '#/pattern/assessment');
    if ((await page.locator('form fieldset input[type=radio]').count()) !== 105) throw new Error('題數');
    const qs = await page.locator('form section fieldset').all();
    if (qs.length !== 21) throw new Error('fieldset ' + qs.length);
    for (let i = 0; i < 21; i++) await qs[i].locator('label').nth(i % 5).click();
    await page.getByRole('button', { name: '過度依賴便利' }).click();
    await page.getByRole('button', { name: '查看結果並儲存' }).click();
    await page.getByRole('heading', { name: '評估結果' }).waitFor();
    await page.getByText('建議練習工具').waitFor();
    const s = await store(page);
    if (s.patternAssessments.length !== 1 || JSON.stringify(s.patternFocus) !== '["convenience"]') throw new Error('評估');
    await page.getByText('不是醫學或心理診斷').first().waitFor();
  });
  await step('習慣改變工作坊：七步驟、建立 If-Then 與微承諾、回顧', async () => {
    await page.goto(BASE + '#/pattern/workshop');
    await page.getByLabel('想處理的習慣').selectOption('shortterm');
    await page.getByRole('button', { name: '開始新的工作坊' }).click();
    await page.getByLabel(/我最常重複的行為/).fill('睡前看影片到兩點');
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByLabel('通常發生的時間').fill('晚上 11 點');
    await page.getByLabel('當時的情緒').fill('疲倦');
    await page.getByLabel('環境提示').fill('躺上床');
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByLabel('舊行為帶來的短期好處').fill('放鬆');
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByLabel(/我的替代行動/).fill('關閉自動播放');
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByLabel('如果（情境）').fill('晚上 11 點躺上床');
    await page.getByLabel('我就（行動）').fill('把手機放到書桌');
    await page.getByRole('button', { name: '建立 If-Then 計畫' }).click();
    await page.getByRole('button', { name: '同時加入每日微承諾' }).click();
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByRole('link', { name: '開始今日練習' }).waitFor();
    await page.getByRole('button', { name: '下一步' }).click();
    await page.getByLabel(/這一週，我觀察到什麼/).fill('前兩天有做到');
    await page.getByRole('button', { name: '降低難度' }).click();
    await page.getByRole('button', { name: '完成本次回顧' }).click();
    const s = await store(page);
    const w = s.workshops[0];
    if (w.step !== 7 || !w.reviewedAt || w.cue !== '躺上床' || !w.planId) throw new Error(JSON.stringify(w));
    if (!s.plans.some((p) => p.id === w.planId) || s.microCommitments.length !== 2) throw new Error('If-Then / 微承諾');
    await page.getByRole('button', { name: '回到工作坊列表' }).click();
    await page.getByRole('button', { name: '繼續' }).waitFor();
  });
  await step('14 天打破慣性挑戰：開始、完成、切換、暫停、保留進度、與原挑戰分開', async () => {
    await page.goto(BASE + '#/challenge?type=pattern');
    await page.getByLabel('習慣', { exact: true }).selectOption('promises');
    await page.getByRole('button', { name: '開始挑戰' }).click();
    await page.getByText('Break the Pattern · Day 1 / 14').waitFor();
    await page.getByRole('heading', { name: '今日行動' }).waitFor();
    await page.getByText('今日心智語句').waitFor();
    await page.getByRole('button', { name: '出現一次' }).click();
    await page.getByLabel('完成紀錄').fill('建立了第一個微承諾');
    await page.getByRole('button', { name: '儲存並標記完成' }).click();
    await page.getByRole('button', { name: '輕量版' }).click();
    await page.getByText(/輕量版：/).first().waitFor();
    await page.getByLabel('習慣', { exact: true }).selectOption('solitude');
    await page.getByRole('button', { name: '切換到這個挑戰' }).click();
    await page.getByRole('button', { name: '暫停挑戰' }).click();
    let s = await store(page);
    if (s.patternChallenge.status !== 'paused' || s.patternChallenge.activeHabitId !== 'solitude' || s.patternChallenge.level !== 'gentle') throw new Error(JSON.stringify(s.patternChallenge));
    if (!s.patternChallenge.progress.promises['1'].completed || s.patternChallenge.progress.promises['1'].oldPattern !== 'once') throw new Error('進度遺失');
    if (s.challenge['1']) throw new Error('影響了原本的 14 天挑戰');
    await page.reload();
    await page.getByRole('button', { name: '恢復挑戰' }).first().click();
    await page.getByLabel('習慣', { exact: true }).selectOption('promises');
    await page.getByRole('button', { name: '切換到這個挑戰' }).click();
    await page.getByRole('button', { name: '第 1 天（已完成）' }).waitFor();
    await page.getByRole('tab', { name: '神經可塑性練習' }).click();
    await page.getByRole('heading', { name: '找出最想改變的習慣' }).waitFor();
  });
  await step('Daily：自由選擇今日練習句、卡片顯示相關習慣', async () => {
    await page.goto(BASE + '#/daily');
    await page.locator('section[aria-labelledby="pick-h"]').getByRole('button', { name: /今天是新的機會/ }).click();
    const l = (await store(page)).dailyLogs[0];
    if (l.practiceId !== 7 || l.why !== '提醒我先看事實') throw new Error(JSON.stringify(l));
    const card = page.locator('article').filter({ hasText: '今天是新的機會' }).first();
    await card.getByRole('button', { name: '反思與行動' }).click();
    await card.getByRole('link', { name: '打破慣性：反覆違背承諾' }).waitFor();
  });
  await step('14 天挑戰：完成、取消、紀錄保留於重新整理後', async () => {
    await page.goto(BASE + '#/challenge?day=3');
    await page.getByLabel('我的紀錄與反思').fill('我發現是焦慮');
    await page.getByLabel('我的回答').fill('我在家很安全');
    await page.getByRole('button', { name: '儲存並標記完成' }).click();
    await page.getByRole('status').filter({ hasText: '🌱' }).waitFor();
    await page.reload();
    await page.getByRole('button', { name: '已完成（點擊取消）' }).waitFor();
    if ((await page.getByLabel('我的紀錄與反思').inputValue()) !== '我發現是焦慮') throw new Error('未保留');
    const s = await store(page);
    if (s.challenge['3'].affirmationReflection !== '我在家很安全') throw new Error('語句反思');
    if (s.dailyLogs.length !== 1 || s.dailyLogs[0].why !== '提醒我先看事實') throw new Error('挑戰覆蓋了每日紀錄 ' + JSON.stringify(s.dailyLogs));
    await page.getByRole('button', { name: '已完成（點擊取消）' }).click();
    if ((await store(page)).challenge['3'].completed) throw new Error('取消失敗');
    await page.getByRole('button', { name: '儲存並標記完成' }).click();
  });
  await step('反思日誌：新增、搜尋、編輯、刪除', async () => {
    await page.goto(BASE + '#/journal');
    await page.getByRole('button', { name: '寫一篇日誌' }).click();
    await page.getByLabel('標題（選填）').fill('第一次拒絕');
    await page.getByLabel(/^內容/).fill('今天我說了不');
    await page.getByRole('button', { name: /很好/ }).click();
    await page.getByLabel('自訂標籤').fill('界線');
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: '儲存日誌' }).click();
    await page.getByLabel('搜尋日誌').fill('拒絕');
    await page.getByText('今天我說了不').waitFor();
    await page.getByRole('button', { name: '編輯日誌' }).click();
    await page.getByLabel(/^內容/).fill('今天我溫和地說了不');
    await page.getByRole('button', { name: '儲存修改' }).click();
    await page.getByText('今天我溫和地說了不').waitFor();
    const s = await store(page);
    if (s.journal[0].tags[0] !== '界線') throw new Error('標籤');
  });
  await step('章節筆記：依章節篩選、編輯、刪除', async () => {
    await page.goto(BASE + '#/journal?tab=notes');
    await page.getByLabel('依章節篩選').selectOption('ch1');
    await page.getByText('共 2 則').waitFor();
    await page.getByRole('button', { name: '刪除筆記' }).first().click();
    await page.getByRole('dialog').getByRole('button', { name: '刪除' }).click();
    await page.getByText('共 1 則').waitFor();
  });
  await step('全站搜尋（快捷鍵 /）', async () => {
    await page.goto(BASE + '#/');
    await page.keyboard.press('/');
    await page.getByLabel('搜尋關鍵字').fill('66 天');
    await page.getByRole('option').first().waitFor();
    await page.keyboard.press('Enter');
    await page.waitForURL(/learn|challenge/);
  });
  await step('儀表板顯示真實資料', async () => {
    await page.goto(BASE + '#/dashboard');
    await page.getByText('1/9', { exact: true }).first().waitFor();
    await page.getByText('「我的想法不等於事實」· 1 次').waitFor();
    await page.locator('.recharts-bar').first().waitFor();
    if ((await page.locator('.recharts-bar-rectangle path').count()) < 1) throw new Error('長條圖沒有資料');
    await page.getByText('踏出第一步').waitFor();
    await page.getByText('看見自己的模式').waitFor();
    await page.getByRole('heading', { name: 'Break the Pattern｜打破慣性' }).waitFor();
    await page.getByText('七大習慣自我評估變化').waitFor();
    await page.getByText('晚上 11 點').first().waitFor();
    await page.getByText('關閉自動播放').first().waitFor();
  });
  await step('主題切換與字體大小', async () => {
    await page.getByRole('button', { name: /^主題：/ }).click();
    await page.getByRole('button', { name: /^主題：/ }).click();
    if (!(await page.evaluate(() => document.documentElement.classList.contains('dark')))) throw new Error('非深色');
    await page.getByRole('button', { name: /^字體大小/ }).click();
    if ((await page.evaluate(() => document.documentElement.dataset.font)) !== 'lg') throw new Error('字體');
    if (process.env.SHOT_DIR) await page.screenshot({ path: `${process.env.SHOT_DIR}/dashboard-dark.png` });
    await page.getByRole('button', { name: /^主題：/ }).click();
    await page.getByRole('button', { name: /^字體大小/ }).click();
    await page.getByRole('button', { name: /^字體大小/ }).click();
    await page.getByRole('button', { name: /^字體大小/ }).click();
  });
  await step('資料匯出（JSON）與錯誤格式匯入驗證', async () => {
    await page.goto(BASE + '#/data');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /下載完整備份/ }).click()]);
    const p = await dl.path();
    const json = JSON.parse(require('fs').readFileSync(p, 'utf8'));
    if (json.app !== 'rewire' || json.data.journal.length !== 1) throw new Error('備份內容');
    require('fs').writeFileSync('/tmp/claude-0/backup.json', JSON.stringify(json));
    require('fs').writeFileSync('/tmp/claude-0/bad.json', '{"foo":1}');
    await page.locator('#import-file').setInputFiles('/tmp/claude-0/bad.json');
    await page.getByRole('alert').filter({ hasText: '找不到 Rewire 備份標記' }).waitFor();
  });
  await step('清除所有紀錄（確認）後再從備份還原', async () => {
    await page.getByRole('button', { name: '清除所有紀錄' }).click();
    await page.getByRole('dialog').getByRole('button', { name: '我了解，清除全部' }).click();
    if ((await store(page)).journal.length !== 0) throw new Error('未清除');
    await page.locator('#import-file').setInputFiles('/tmp/claude-0/backup.json');
    await page.getByRole('dialog').getByRole('button', { name: '確認還原' }).click();
    await page.getByRole('alert').filter({ hasText: '還原成功' }).waitFor();
    if ((await store(page)).journal.length !== 1) throw new Error('未還原');
  });
  await step('研究來源頁與 404 頁', async () => {
    await page.goto(BASE + '#/references');
    await page.getByText('待查證').first().waitFor();
    await page.goto(BASE + '#/nope');
    await page.getByText('這條小徑還沒有被走出來').waitFor();
  });
  await step('無資料空狀態（新的瀏覽器）', async () => {
    const c2 = await browser.newContext();
    const p2 = await c2.newPage();
    await p2.goto(BASE + '#/dashboard');
    await p2.getByText('還沒有練習紀錄').first().waitFor();
    await p2.getByText('0/9').first().waitFor();
    await c2.close();
  });

  // ===== 手機版 =====
  const mctx = await browser.newContext({ ...devices['iPhone 13'] });
  const m = await mctx.newPage();
  m.on('pageerror', (e) => errors.push('mobile: ' + e.message));
  await step('手機版：所有頁面無橫向捲動', async () => {
    const routes = ['', 'daily', 'learn', 'learn/ch1', 'learn/ch2', 'learn/ch6', 'learn/ch7', 'learn/ch9', 'lab', 'lab/habit-curve', 'challenge', 'journal', 'journal?tab=notes', 'dashboard', 'references', 'data', 'daily/read', 'pattern', 'pattern/approval', 'pattern/impress', 'pattern/promises', 'pattern/shortterm', 'pattern/assessment', 'pattern/workshop', 'challenge?type=pattern'];
    const bad = [];
    for (const r of routes) {
      await m.goto(BASE + '#/' + r);
      await m.waitForTimeout(250);
      const w = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (w > 1) bad.push(`${r}:${w}px`);
    }
    if (bad.length) throw new Error(bad.join(', '));
  });
  await step('手機版：底部導覽與抽屜選單', async () => {
    await m.goto(BASE + '#/');
    await m.getByRole('navigation', { name: '主要功能' }).waitFor();
    await m.getByRole('button', { name: '開啟章節與功能選單' }).click();
    await m.getByRole('dialog', { name: '網站選單' }).getByRole('link', { name: /66 天習慣養成/ }).click();
    await m.getByRole('heading', { name: '66 天習慣養成與非線性改變', level: 1 }).waitFor();
    await m.getByRole('navigation', { name: '主要功能' }).getByRole('link', { name: '14 天練習' }).click();
    await m.waitForURL(/challenge/);
  });
  if (process.env.SHOT_DIR) {
    for (const [r, n] of [['pattern', 'm-pattern'], ['pattern/promises', 'm-promises'], ['challenge?type=pattern', 'm-pchallenge'], ['dashboard', 'm-dash'], ['', 'm-home'], ['daily/read', 'm-read'], ['learn/ch1', 'm-ch1'], ['challenge', 'm-challenge']]) {
      await m.goto(BASE + '#/' + r); await m.waitForTimeout(400);
      await m.screenshot({ path: `${process.env.SHOT_DIR}/${n}.png` });
    }
    await page.goto(BASE + '#/'); await page.waitForTimeout(400);
    await page.screenshot({ path: `${process.env.SHOT_DIR}/d-home.png` });
    await page.goto(BASE + '#/learn/ch1'); await page.waitForTimeout(400);
    await page.screenshot({ path: `${process.env.SHOT_DIR}/d-ch1.png` });
  }

  await browser.close();
  for (const [s, n] of results) console.log(s, n);
  console.log(errors.length ? `\nConsole errors:\n${[...new Set(errors)].join('\n')}` : '\nNo console errors');
  const failed = results.filter((r) => r[0] === '✗').length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})();
