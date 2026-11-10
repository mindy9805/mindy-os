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
    const routes = ['', 'daily', 'learn', 'learn/ch1', 'learn/ch2', 'learn/ch6', 'learn/ch7', 'learn/ch9', 'lab', 'lab/habit-curve', 'challenge', 'journal', 'journal?tab=notes', 'dashboard', 'references', 'data', 'daily/read'];
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
    for (const [r, n] of [['', 'm-home'], ['daily/read', 'm-read'], ['learn/ch1', 'm-ch1'], ['challenge', 'm-challenge']]) {
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
