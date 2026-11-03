/* =====================================================================
   MINDY OS — 互動程式
   ---------------------------------------------------------------------
   每個功能都是一個獨立的 init 函式，並透過 safe() 啟動：
   就算其中一個功能出錯，其他功能仍能正常運作（錯誤會顯示在瀏覽器主控台）。

   功能清單
   1. 導覽列（漢堡選單、目前區塊高亮）
   2. 探索地圖與功能卡片
   3. 作品卡片 + 篩選 + 作品視窗
   4. 合作互動（依專長顯示合作情境）
   5. 彩蛋（植物、首頁 Mindy、隱藏訊息、輸入 mindy、Logo 連點）
   6. 捲動進場動畫
   7. 簡報模式（8 頁、鍵盤／簡報筆／觸控滑動、講稿、計時、全螢幕備援）
   ===================================================================== */
(function () {
  'use strict';

  const DATA = window.MINDY_DATA || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 安全啟動：某個功能壞掉也不會讓整個網站停擺 */
  function safe(name, fn) {
    try { fn(); } catch (err) { console.warn('[MINDY OS] 「' + name + '」初始化失敗：', err); }
  }

  /* 把文字轉成安全的 HTML（避免資料中的特殊符號破壞版面） */
  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* 瀏覽器小型儲存（私密瀏覽模式可能無法使用，所以包在 try 裡） */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('mindy-os:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mindy-os:' + k, JSON.stringify(v)); } catch (e) { /* 忽略 */ } }
  };

  /* 中文標題斷行：在「，。、」等標點後切成詞組，避免把一個詞拆成兩行 */
  function phrases(text) {
    return esc(text).split(/(?<=[，。、；：！？])/).map(t => `<span class="phrase">${t}</span>`).join('');
  }

  /* 平滑捲動到某個區塊 */
  function goTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- 提示訊息 toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    // 重新觸發進場動畫
    t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 3800);
  }

  /* ---------- Mindy 從角落探頭 ---------- */
  let peekTimer;
  function peek(text) {
    const p = $('#peek');
    if (!p) return;
    $('#peekText').textContent = text;
    p.classList.add('show');
    clearTimeout(peekTimer);
    peekTimer = setTimeout(() => p.classList.remove('show'), 3200);
  }

  /* =================================================================
     1. 導覽列
     ================================================================= */
  function initNav() {
    const menu = $('#menu'), links = $('#links');
    const setOpen = open => { links.classList.toggle('open', open); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '收合選單' : '展開選單'); };
    menu.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    $$('#links a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', e => { if (!links.contains(e.target) && !menu.contains(e.target)) setOpen(false); });

    // 捲動時，高亮目前所在區塊的導覽連結
    if (!('IntersectionObserver' in window)) return;
    const map = {};
    $$('#links a').forEach(a => { map[a.getAttribute('href').slice(1)] = a; });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        $$('#links a').forEach(a => a.classList.remove('active'));
        if (map[en.target.id]) map[en.target.id].classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  }

  /* =================================================================
     2. 探索地圖與功能卡片
     ================================================================= */
  function initExplore() {
    const avatar = $('#mapAvatar'), map = $('#map');
    const nodes = map ? $$('.map-node', map) : [];
    const svg = $('#trail'), path = $('#trailPath');
    const isPhone = () => window.matchMedia('(max-width: 720px)').matches;
    const avatarShown = () => avatar && getComputedStyle(avatar).display !== 'none';

    // 取得目的地相對於地圖的位置
    const box = node => {
      const m = map.getBoundingClientRect(), r = node.getBoundingClientRect();
      return { left: r.left - m.left, top: r.top - m.top + map.scrollTop, width: r.width, height: r.height };
    };
    // 小 Mindy 走到某個目的地旁邊（電腦：目的地上方；手機：目的地旁的空白處）
    const walkTo = node => {
      if (!avatarShown()) return;
      const size = avatar.offsetWidth, b = box(node);
      let left, top;
      if (isPhone()) {
        const onLeft = b.left + b.width / 2 < map.clientWidth / 2;
        left = onLeft ? b.left + b.width + 14 : b.left - size - 14;
        top = b.top + b.height / 2 - size / 2;
      } else {
        left = b.left + b.width / 2 - size / 2;
        top = b.top - size - 6;
      }
      avatar.style.left = Math.max(6, Math.min(map.clientWidth - size - 6, left)) + 'px';
      avatar.style.top = Math.max(isPhone() ? 6 : 60, top) + 'px';
    };

    // 手機版：依目的地的位置，畫一條彎彎曲曲的虛線小徑
    const drawTrail = () => {
      if (!svg || !path || !map) return;
      if (!isPhone()) { svg.style.display = 'none'; return; }
      svg.style.display = 'block';
      const pts = nodes.map(n => { const b = box(n); return [b.left + b.width / 2, b.top + b.height / 2]; });
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2;
        d += ` C${x0} ${my} ${x1} ${my} ${x1} ${y1}`;
      }
      svg.setAttribute('width', map.clientWidth);
      svg.setAttribute('height', map.scrollHeight);
      path.setAttribute('d', d);
    };
    let current = nodes[0];
    const layout = () => { drawTrail(); if (current) walkTo(current); };

    // 點擊目的地：Mindy 先走過去，再帶你前往該區塊
    $$('[data-go]').forEach(el => el.addEventListener('click', () => {
      if (el.classList.contains('map-node') && avatarShown() && !reduceMotion) {
        current = el; walkTo(el);
        setTimeout(() => goTo(el.dataset.go), 620);
      } else {
        goTo(el.dataset.go);
      }
    }));
    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => { current = node; walkTo(node); });
      node.addEventListener('focus', () => { current = node; walkTo(node); });
    });
    if (!map) return;
    layout();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layout, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
    window.addEventListener('load', layout);
  }

  /* =================================================================
     3. 作品卡片系統
     ================================================================= */
  const projects = DATA.projects || [];
  const colors = DATA.categoryColors || {};

  /* 雙語標籤「ENGLISH · 中文」：中文部分包起來，避免被拆成兩行 */
  function biLabel(label) {
    const i = String(label).lastIndexOf(' · ');
    return i < 0 ? esc(label) : esc(label.slice(0, i)) + '<span class="eb-zh">' + esc(label.slice(i)) + '</span>';
  }

  /* 卡片封面：有截圖就顯示第一張；沒有就顯示概念示意圖並標註 */
  function projectCover(p) {
    const imgs = p.images || [];
    if (imgs.length) {
      const first = imgs[0];
      return `<img src="${esc(first.src)}" alt="${esc(first.alt || p.name + ' 作品截圖')}" loading="lazy" data-fallback="${esc(p.cat)}">
        <span class="visual-tag real">實際作品截圖</span>${imgs.length > 1 ? `<span class="visual-count">${imgs.length} 張</span>` : ''}`;
    }
    return `${(DATA.conceptArt || {})[p.cat] || ''}<span class="visual-tag">概念示意｜非實際截圖</span>`;
  }

  /* 截圖檔案找不到時，自動換回概念示意圖，避免出現破圖 */
  function attachImgFallback(root) {
    $$('img[data-fallback]', root).forEach(img => {
      img.addEventListener('error', () => {
        const box = img.parentElement;
        const cat = img.dataset.fallback;
        console.warn('[MINDY OS] 找不到作品圖片：', img.getAttribute('src'));
        box.innerHTML = `${(DATA.conceptArt || {})[cat] || ''}<span class="visual-tag">圖片載入失敗，暫以概念示意</span>`;
      }, { once: true });
    });
  }

  /* 作品有線上網址時，顯示「開啟作品」按鈕（另開新分頁） */
  function linkBtn(p) {
    const list = (p.links || []).slice();
    if (p.link) list.unshift({ label: p.linkLabel || '開啟作品', url: p.link });
    return list.filter(l => /^https?:\/\//.test(l.url || ''))
      .map(l => `<a class="project-link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label || '開啟作品')} ↗</a>`).join('');
  }
  /* 卡片上方的課堂單元標籤 */
  function unitTags(p) {
    return (p.units || []).length ? `<div class="unit-tags">${p.units.map(u => `<span class="unit-tag">${esc(u)}</span>`).join('')}</div>` : '';
  }

  function renderProjects(filter) {
    const box = $('#projects');
    const list = projects.filter(p => filter === 'all' || p.cat === filter);
    box.innerHTML = list.map(p => `
      <article class="card project">
        <button type="button" class="project-visual" style="background:${esc(colors[p.cat] || '#eee')}" data-project="${esc(p.id)}" aria-label="查看「${esc(p.name)}」專案摘要">${projectCover(p)}</button>
        <div class="project-body">
          ${unitTags(p)}
          <small>${biLabel(p.label)}${p.featured ? ' · <span class="featured-flag">★ FEATURED · 主打作品</span>' : ''}</small>
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="pills">${(p.tools || []).map(t => `<span class="pill">${esc(t)}</span>`).join('')}</div>
          <span class="project-status">📎 ${esc(p.state || '')}</span>
          <div class="project-actions">
            <button type="button" class="arrowlink" data-project="${esc(p.id)}">查看專案摘要 ↗</button>
            ${linkBtn(p)}
          </div>
        </div>
      </article>`).join('') || '<p class="muted">這個分類目前還沒有作品。</p>';
    $$('[data-project]', box).forEach(b => b.addEventListener('click', () => openProject(b.dataset.project, b)));
    attachImgFallback(box);
  }

  function initProjects() {
    renderProjects('all');
    $$('#filters button').forEach(b => b.addEventListener('click', () => {
      $$('#filters button').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('active'); b.setAttribute('aria-pressed', 'true');
      renderProjects(b.dataset.filter);
    }));
    initModal();
  }

  /* ---------- 作品視窗 ---------- */
  const overlay = $('#overlay');
  let lastFocus = null;

  function openProject(id, opener) {
    const p = projects.find(x => x.id === id);
    if (!p) return;
    const imgs = p.images || [];
    const gallery = imgs.length
      ? `<div class="gallery">${imgs.map(im => `<figure><img src="${esc(im.src)}" alt="${esc(im.alt || p.name)}" loading="lazy">${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ''}</figure>`).join('')}</div>`
      : `<div class="gallery-placeholder"><div class="concept" style="background:${esc(colors[p.cat] || '#eee')}">${(DATA.conceptArt || {})[p.cat] || ''}</div>📎 ${esc(p.state)}。上方為概念示意圖，並非作品實際截圖。</div>`;
    $('#modalContent').innerHTML = `
      <div class="eyebrow">${biLabel(p.label)}</div>
      <h2 id="modalTitle">${esc(p.name)}</h2>
      <p>${esc(p.detail)}</p>
      <div class="pills">${(p.tools || []).map(t => `<span class="pill">${esc(t)}</span>`).join('')}</div>
      ${unitTags(p)}
      ${linkBtn(p) ? `<p class="modal-link">${linkBtn(p)}</p>` : ''}
      ${gallery}`;
    lastFocus = opener || document.activeElement;
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    $('#closeModal').focus();
  }

  function closeModal() {
    if (!overlay.classList.contains('show')) return;
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function initModal() {
    $('#closeModal').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('show')) return;
      if (e.key === 'Escape') { closeModal(); return; }
      // 鍵盤 Tab 只在視窗內循環（無障礙）
      if (e.key === 'Tab') {
        const f = $$('button, a[href], [tabindex]:not([tabindex="-1"])', overlay);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* =================================================================
     4. 合作互動
     ================================================================= */
  function initConnect() {
    const form = $('#connectForm'), out = $('#match'), avatar = $('#connectAvatar');
    const boxes = $$('input[name="skills"]', form);
    const otherWrap = $('#otherWrap'), otherInput = $('#cOther');
    const nameInput = $('#cName'), msg = $('#cMsg'), submitBtn = $('#cSubmit'), status = $('#formStatus');
    const done = $('#connectDone');

    // 合作情境：顯示「最後勾選」的專長；都沒勾時顯示提示
    let lastPicked = null;
    const showMatch = animate => {
      const picked = boxes.filter(b => b.checked).map(b => b.value);
      const key = picked.includes(lastPicked) ? lastPicked : picked[picked.length - 1];
      const m = key && (DATA.matches || {})[key];
      out.innerHTML = m
        ? `<strong>✨ ${esc(m[0])}</strong><p>${esc(m[1])}</p>`
        : '<strong>✨ 勾選你的專長</strong><p>看看我們可以一起嘗試什麼樣的合作。</p>';
      if (animate && avatar) { avatar.classList.remove('pop'); void avatar.offsetWidth; avatar.classList.add('pop'); }
    };
    boxes.forEach(b => b.addEventListener('change', () => {
      if (b.checked) lastPicked = b.value;
      if (b.value === 'other') { otherWrap.hidden = !b.checked; if (b.checked) otherInput.focus(); }
      if (boxes.some(x => x.checked)) $('#errSkills').hidden = true;
      showMatch(b.checked);
    }));
    showMatch(false);

    // 留言字數
    const count = () => { $('#msgCount').textContent = msg.value.length + ' / 200'; };
    msg.addEventListener('input', count);
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) { $('#errName').hidden = true; nameInput.setAttribute('aria-invalid', 'false'); }
    });

    const setStatus = (text, kind) => {
      status.hidden = !text;
      status.textContent = text || '';
      status.className = 'form-status' + (kind ? ' ' + kind : '');
    };

    // 修改內容時，收起上一次的錯誤提示
    form.addEventListener('input', () => { if (!status.hidden) setStatus(''); });
    form.addEventListener('change', () => { if (!status.hidden) setStatus(''); });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      setStatus('');
      const name = nameInput.value.trim();
      const picked = boxes.filter(b => b.checked).map(b => b.value);
      // 檢查必填
      $('#errName').hidden = !!name;
      $('#errSkills').hidden = picked.length > 0;
      if (!name) { nameInput.setAttribute('aria-invalid', 'true'); nameInput.focus(); return; }
      if (!picked.length) { boxes[0].focus(); return; }

      const endpoint = ((DATA.form || {}).endpoint || '').trim();
      if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(endpoint)) {
        setStatus('表單尚未啟用：Mindy 還沒完成 Google 試算表設定，資料目前不會被送出。', 'error');
        return;
      }
      if ($('#cWebsite').value) return; // 機器人填了隱藏欄位，直接忽略

      const labels = DATA.skillLabels || {};
      const pres = document.getElementById('present');
      const payload = {
        name: name.slice(0, 30),
        skills: picked.map(v => labels[v] || v),
        other: picked.includes('other') ? otherInput.value.trim().slice(0, 30) : '',
        message: msg.value.trim().slice(0, 200),
        source: pres && !pres.hidden ? '簡報' : '網站'
      };

      submitBtn.disabled = true;
      submitBtn.textContent = '送出中…';
      const ctrl = 'AbortController' in window ? new AbortController() : null;
      const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, 15000);
      try {
        // Google Apps Script 不提供跨網域回應，因此用 no-cors 送出（送達即視為成功）
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          signal: ctrl ? ctrl.signal : undefined
        });
        form.hidden = true;
        $('#doneTitle').textContent = '謝謝你，' + payload.name + '！';
        done.hidden = false;
        done.focus();
      } catch (err) {
        console.warn('[MINDY OS] 表單送出失敗：', err);
        setStatus('送出失敗，可能是網路不穩。你填的內容都還在，請稍後再按一次「送出」。', 'error');
      } finally {
        clearTimeout(timer);
        submitBtn.disabled = false;
        submitBtn.textContent = '送出給 Mindy ↗';
      }
    });

    // 再填一份：清空表單
    $('#againBtn').addEventListener('click', () => {
      form.reset();
      otherWrap.hidden = true;
      lastPicked = null;
      count(); showMatch(false); setStatus('');
      done.hidden = true; form.hidden = false;
      nameInput.focus();
    });

    $('#shareBtn').addEventListener('click', async () => {
      const url = location.href.split('#')[0];
      try {
        if (location.protocol === 'file:') throw new Error('local file');
        await navigator.clipboard.writeText(url);
        toast('已複製網站連結！');
      } catch (e) {
        toast('目前是本機預覽；部署到 GitHub Pages 後，就能複製公開網址。');
      }
    });
  }

  /* =================================================================
     5. 彩蛋
     ================================================================= */
  function initEasterEggs() {
    // (a) 右下角小植物：每點一次好奇心 +1，植物會長大，第 5 次會開花並讓 Mindy 探頭
    const btn = $('#easter'), plant = $('#plant'), count = $('#plantCount');
    const stages = DATA.plantStages || ['🌱'];
    const msgs = DATA.plantMessages || ['好奇心 +1！'];
    let n = store.get('curiosity', 0);
    const paint = () => {
      plant.textContent = stages[Math.min(n, stages.length) - 1] || stages[0];
      count.textContent = n ? String(n) : '';
    };
    paint();
    btn.addEventListener('click', () => {
      n += 1; store.set('curiosity', n); paint();
      btn.classList.remove('grow'); void btn.offsetWidth; btn.classList.add('grow');
      if (n <= msgs.length) toast(msgs[n - 1]);
      else toast('🌸 好奇心 +1（目前累積 ' + n + '）！探索永遠不嫌多。');
      if (n === stages.length) peek('哇！開花了！');
    });

    // 手機首頁：小植物按鈕會先收起來，避免擋住「看看我的作品」按鈕；往下捲動後才出現
    const cta = $('.hero-actions');
    if (cta && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        btn.classList.toggle('tucked', en.isIntersecting && innerWidth <= 720);
      }).observe(cta);
    }

    // (b) 點首頁 Mindy：跳一下並說一句話
    const hero = $('#heroMindy'), speech = $('#speech');
    const lines = DATA.mindySays || ['嗨！'];
    let i = 0, speechTimer;
    hero.addEventListener('click', () => {
      speech.textContent = lines[i % lines.length]; i++;
      speech.classList.add('show');
      hero.classList.remove('hop'); void hero.offsetWidth; hero.classList.add('hop');
      clearTimeout(speechTimer);
      speechTimer = setTimeout(() => speech.classList.remove('show'), 2800);
    });
    hero.addEventListener('animationend', e => { if (e.animationName === 'hop') hero.classList.remove('hop'); });

    // (c) User Manual 隱藏系統訊息
    $('#secretManual').addEventListener('click', () => toast('🔓 隱藏系統訊息：好奇心是預設開啟的功能。'));

    // (d) 在鍵盤上輸入 m-i-n-d-y：Mindy 從左下角探頭
    let typed = '';
    document.addEventListener('keydown', e => {
      if (e.target.matches && e.target.matches('input, textarea, select')) return;
      if (!e.key || e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-5);
      if (typed === 'mindy') { peek('被你找到了！好奇心 +1'); typed = ''; }
    });

    // (e) 連點 Logo 5 次：系統版本「更新」
    let clicks = 0, clickTimer;
    $('#logo').addEventListener('click', () => {
      clicks++; clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clicks = 0; }, 1500);
      if (clicks === 5) {
        $('#logoVersion').textContent = 'v1.1 CURIOUS';
        toast('⬆ 系統更新完成：MINDY OS v1.1，好奇心模組已升級！');
        clicks = 0;
      }
    });
  }

  /* =================================================================
     6. 捲動進場動畫
     ================================================================= */
  function initReveal() {
    const els = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    // 保險：3 秒後全部顯示（避免任何意外讓內容一直隱藏）
    setTimeout(() => els.forEach(el => el.classList.add('in')), 3000);
  }

  /* =================================================================
     7. 簡報模式
     快捷鍵：→ ↓ 空白鍵 PageDown 下一頁｜← ↑ PageUp 上一頁｜Home/End 首尾頁
             F 全螢幕｜Esc 結束
     網址加上 #present 可直接開啟簡報（#present-5 直接到第 5 頁）
     ================================================================= */
  function initPresentation() {
    const slides = DATA.slides || [];
    const pres = $('#present'), stage = $('#slideStage'), dots = $('#slideDots');
    const IMG = DATA.images || {};
    let current = 0, isOpen = false;
    let startTime = 0, timerId = null;
    const totalSec = slides.reduce((s, x) => s + (x.sec || 0), 0);

    // 頁碼點點（手機版改顯示「3 / 8」）
    dots.innerHTML = slides.map((s, i) => `<button type="button" data-i="${i}" aria-label="第 ${i + 1} 頁：${esc(s.t)}">${i + 1}</button>`).join('') + '<span class="slide-count" id="slideCount"></span>';
    $$('button', dots).forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));

    function mediaHtml(s) {
      // 作品頁：有截圖就放截圖，沒有就放概念示意（並清楚標示）
      if (s.project) {
        const p = projects.find(x => x.id === s.project) || {};
        const shot = (p.images || [])[0];
        return `<div class="slide-media wide feature-shot"><div class="slide-shot" style="background:${esc(colors[p.cat] || '#eee')}">${shot
          ? `<img src="${esc(shot.src)}" alt="${esc(shot.alt || p.name)}"><span class="visual-tag real">實際作品截圖</span>`
          : `${(DATA.conceptArt || {})[p.cat] || ''}<span class="visual-tag">概念示意｜非實際截圖</span>`}</div></div>`;
      }
      if (s.gallery) {
        return `<div class="slide-media wide"><div class="slide-minis">${s.gallery.map(id => {
          const p = projects.find(x => x.id === id) || {};
          const shot = (p.images || [])[0];
          return `<div class="slide-shot" style="background:${esc(colors[p.cat] || '#eee')}">${shot ? `<img src="${esc(shot.src)}" alt="${esc(shot.alt || p.name)}">` : (DATA.conceptArt || {})[p.cat] || ''}</div>`;
        }).join('')}</div></div>`;
      }
      // 最後一頁：QR code（掃描開啟合作填寫區）＋角色
      if (s.qr) {
        return `<div class="slide-media slide-qr-wrap">
          <figure class="slide-qr"><img src="${esc(s.qr)}" width="330" height="330" alt="QR code：掃描開啟 MINDY OS 合作填寫區"><figcaption>掃描 QR code<br>留下名字與專長</figcaption></figure>
          ${s.img && IMG[s.img] ? `<img class="fullbody qr-mindy" src="${esc(IMG[s.img])}" alt="Mindy 角色插圖">` : ''}
        </div>`;
      }
      if (s.img && IMG[s.img]) {
        return `<div class="slide-media"><img class="fullbody" src="${esc(IMG[s.img])}" alt="Mindy 角色插圖"></div>`;
      }
      return '';
    }

    /* 重點方塊：文字維持一行；放不下時逐步縮小字級（最小 12px），不換行、不超出方塊 */
    function fitPills() {
      $$('.slide-extra li', stage).forEach(li => {
        li.querySelectorAll('wbr').forEach(w => w.remove()); // 移除換行點，確保一行
        li.style.fontSize = '';
        let size = parseFloat(getComputedStyle(li).fontSize);
        while (li.scrollWidth > li.clientWidth + 1 && size > 12) { size -= 0.5; li.style.fontSize = size + 'px'; }
      });
    }
    window.addEventListener('resize', () => { if (isOpen) fitPills(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (isOpen) fitPills(); });

    function render(dir) {
      const s = slides[current];
      stage.innerHTML = `
        <div class="slide ${reduceMotion ? '' : (dir < 0 ? 'enter-prev' : 'enter-next')}">
          <div class="slide-text">
            <div class="eyebrow">${esc(s.k)}</div>
            <h1>${phrases(s.t)}</h1>
            <p class="slide-desc">${esc(s.d)}</p>
            <ul class="slide-extra">${(s.extra || []).map(x => `<li>✦ ${esc(x)}</li>`).join('')}</ul>
          </div>
          ${mediaHtml(s)}
        </div>`;
      stage.scrollTop = 0;
      fitPills();
      $('#progress').style.width = ((current + 1) / slides.length * 100) + '%';
      $('#prev').disabled = current === 0;
      $('#next').innerHTML = current === slides.length - 1 ? '回到首頁 ↺' : '下一頁 →';
      $$('button', dots).forEach((b, i) => b.setAttribute('aria-current', String(i === current)));
      $('#slideCount').textContent = `${current + 1} / ${slides.length}`;
      if (isOpen) history.replaceState(null, '', '#present-' + (current + 1));
    }

    function show(i) {
      if (i < 0 || i >= slides.length || i === current) return;
      const dir = i > current ? 1 : -1;
      current = i; render(dir);
    }
    const next = () => { if (current < slides.length - 1) show(current + 1); else { exit(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); } };
    const prev = () => show(current - 1);

    // 計時器：顯示已講時間，超過建議總時間（約 7 分鐘）會變色提醒
    function tick() {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      const t = $('#timer');
      t.textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
      t.classList.toggle('over', totalSec > 0 && sec > totalSec);
    }
    function resetTimer() { startTime = Date.now(); tick(); }

    function start(at) {
      current = Math.min(Math.max(at || 0, 0), slides.length - 1);
      isOpen = true;
      pres.hidden = false;
      document.body.style.overflow = 'hidden';
      document.dispatchEvent(new Event('mindy:present')); // 背景音樂在簡報時暫停
      render(1);
      resetTimer(); clearInterval(timerId); timerId = setInterval(tick, 1000);
      $('#next').focus();
      // 預先載入所有角色圖，換頁時不會閃爍
      Object.values(IMG).forEach(src => { const im = new Image(); im.src = src; });
    }
    function exit() {
      isOpen = false;
      pres.hidden = true;
      document.body.style.overflow = '';
      clearInterval(timerId);
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      history.replaceState(null, '', location.pathname + location.search);
      $('#presentStart').focus();
    }

    // 全螢幕：不支援時（例如 iPhone Safari）會提示，簡報仍可正常使用
    function toggleFullscreen() {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsEl) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      const req = pres.requestFullscreen || pres.webkitRequestFullscreen;
      if (!req) { toast('這個瀏覽器不支援全螢幕，簡報模式仍可正常使用。手機可加入主畫面或橫放觀看。'); return; }
      try {
        const r = req.call(pres);
        if (r && r.catch) r.catch(() => toast('無法進入全螢幕，簡報模式仍可正常使用。'));
      } catch (e) { toast('無法進入全螢幕，簡報模式仍可正常使用。'); }
    }

    $('#presentStart').addEventListener('click', () => start(0));
    $('#exitPresent').addEventListener('click', exit);
    $('#prev').addEventListener('click', prev);
    $('#next').addEventListener('click', next);
    $('#timer').addEventListener('click', resetTimer);
    $('#fullScreen').addEventListener('click', toggleFullscreen);

    // 鍵盤與簡報筆（簡報筆多半送出 PageUp / PageDown）
    window.addEventListener('keydown', e => {
      if (!isOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); if (current < slides.length - 1) show(current + 1); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); prev(); }
      else if (k === 'Home') { e.preventDefault(); show(0); }
      else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
      else if (k === 'f' || k === 'F') toggleFullscreen();
      else if (k === 'Escape' && !(document.fullscreenElement || document.webkitFullscreenElement)) exit();
    });

    // 手機／平板觸控：左右滑動換頁
    let sx = 0, sy = 0, tracking = false;
    stage.addEventListener('touchstart', e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (!tracking) return; tracking = false;
      const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { dx < 0 ? (current < slides.length - 1 && show(current + 1)) : prev(); }
    }, { passive: true });

    // 網址是 #present 或 #present-3 時，自動開啟簡報（方便發表當天直接開）
    const m = location.hash.match(/^#present(?:-(\d+))?$/);
    if (m) start(m[1] ? parseInt(m[1], 10) - 1 : 0);
  }

  /* =================================================================
     0. 中文斷行：讓換行落在「意思完整」的地方
     -----------------------------------------------------------------
     規則（由小到大）：
     ① 詞：用瀏覽器內建的中文斷詞（Intl.Segmenter）＋下方 KEEP_WORDS 詞庫，詞不會被拆開
     ② 片語：「的、了、們…」黏前一個詞；「與、和、在、讓…」黏後一個詞，行尾不會只剩「與」
     ③ 子句：以「，、；：」結尾的一段話盡量放在同一行，放不下時整段換到下一行
     ④ 句子：段落中遇到「。！？」，下一句從新的一行開始
     KEEP_WORDS：瀏覽器斷錯時，在這裡補上「一定要黏在一起」的詞。
     ================================================================= */
  const KEEP_WORDS = [
    '截圖', '豆皮', '豆豆貼', '鍋貼', '勾選', '優化', '鐘敏恩', '跨域', '表單', '日日好日', '痛點',
    '點擊', '社群', '總表', '教保員', '學務', '受眾', '發想', '選填', '再填', '題型', '方格紙',
    '週次', '待補', '這堂課', '小芽', '滿點', '好奇心', '試算表', '粉圓體', '聯絡簿', '彩蛋',
    '核心理念', '跨領域', '探索者', '說明書', '作業系統', '目的地', '行程表', '時程表',
    '延伸能力', '實現想像'
  ];
  function initWordBreak() {
    if (!window.Intl || !Intl.Segmenter) return; // 舊瀏覽器：維持一般換行
    const seg = new Intl.Segmenter('zh-Hant', { granularity: 'word' });
    const dict = new Set(KEEP_WORDS);
    const CJK = /[㐀-鿿豈-﫿]/;
    const PUNCT = /^[，。、；：！？」』）》〉…—～・,.!?;:)\]%]+$/;     // 不放在行首
    const OPEN_END = /[「『（《〈(\[]$/;                               // 不放在行尾
    const CLAUSE_END = /[，、；：。！？]/;
    const SENTENCE_END = /[。！？]/;
    const GLUE_PREV = new Set(['的', '了', '著', '們', '裡', '得', '嗎', '呢', '吧', '啊', '中', '上']);
    const GLUE_NEXT = new Set(['與', '和', '及', '或', '把', '將', '讓', '在', '從', '對', '向', '給', '為', '被', '跟',
      '一', '很', '更', '最', '也', '都', '還', '就', '才', '只', '我', '你', '他', '她']);
    const SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|TITLE)$/;
    const NO_SENTENCE_BREAK = 'h1,h2,h3,button,label,legend,.pill,.chip,.eyebrow,.section-num,.slide-extra,.phrase,.ln';

    const toWords = text => {
      const parts = Array.from(seg.segment(text), x => x.segment), words = [];
      for (let i = 0; i < parts.length;) {
        let take = 1;
        for (let n = Math.min(4, parts.length - i); n > 1; n--) {
          if (dict.has(parts.slice(i, i + n).join(''))) { take = n; break; }
        }
        words.push(parts.slice(i, i + take).join(''));
        i += take;
      }
      return words;
    };
    // 兩個詞之間可不可以換行
    const canBreak = (prev, w) => !(PUNCT.test(w) || OPEN_END.test(prev) || /\s$/.test(prev) || /^\s/.test(w) ||
      GLUE_PREV.has(w) || GLUE_NEXT.has(prev));

    const processText = node => {
      const text = node.nodeValue, parent = node.parentNode;
      if (!parent || text.length < 3 || !CJK.test(text)) return;
      if (SKIP.test(parent.nodeName) || (parent.closest && parent.closest('svg'))) return;
      if (parent.classList && parent.classList.contains('cl')) return; // 已處理過
      if (parent.closest && parent.closest('.eb-zh, .ln, .slide-extra')) return; // 不可拆開的標籤、簡報重點方塊
      const words = toWords(text);
      // 依標點切成子句
      const clauses = [];
      let cur = [];
      words.forEach((w, i) => {
        cur.push(w);
        const next = words[i + 1];
        if (CLAUSE_END.test(w) && PUNCT.test(w) && !(next && PUNCT.test(next))) { clauses.push(cur); cur = []; }
      });
      if (cur.length) clauses.push(cur);
      // 很短的子句（3 個字以內，例如「現在，」）併入下一個子句，避免自己孤單一行
      for (let i = 0; i < clauses.length - 1; i++) {
        const len = clauses[i].join('').replace(/[\s，、；：。！？]/g, '').length;
        const endsSentence = SENTENCE_END.test(clauses[i].join('').slice(-1));
        if (len <= 3 && !endsSentence) { clauses[i + 1] = clauses[i].concat(clauses[i + 1]); clauses.splice(i, 1); i--; }
      }
      if (words.length < 2 && clauses.length < 2) return;

      const allowSentence = parent.closest && !parent.closest(NO_SENTENCE_BREAK) && !!parent.closest('p, li, figcaption');
      const frag = document.createDocumentFragment();
      const appendWords = (target, list) => list.forEach((w, i) => {
        if (i > 0 && canBreak(list[i - 1], w)) target.appendChild(document.createElement('wbr'));
        target.appendChild(document.createTextNode(w));
      });
      clauses.forEach((c, ci) => {
        if (ci > 0) {
          const prevClause = clauses[ci - 1].join('');
          const hasMore = c.join('').trim().length > 0;
          if (allowSentence && SENTENCE_END.test(prevClause.slice(-2)) && hasMore && CJK.test(c.join(''))) {
            const br = document.createElement('br'); br.className = 'sb'; frag.appendChild(br);
          } else if (!/^\s/.test(c[0])) {
            frag.appendChild(document.createElement('wbr'));
          }
        }
        // 多個子句時：每個子句包成一組，盡量不拆開
        if (clauses.length > 1 && CJK.test(c.join(''))) {
          const span = document.createElement('span');
          span.className = 'cl';
          appendWords(span, c);
          frag.appendChild(span);
        } else {
          appendWords(frag, c);
        }
      });
      parent.replaceChild(frag, node);
    };
    const walk = root => {
      if (root.nodeType === 3) { processText(root); return; }
      if (root.nodeType !== 1 || SKIP.test(root.nodeName)) return;
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const list = [];
      while (tw.nextNode()) list.push(tw.currentNode);
      list.forEach(processText);
    };
    walk(document.body);
    document.documentElement.classList.add('wb'); // 啟用「只在詞間換行」的 CSS
    // 之後動態產生的內容（作品卡片、合作情境、簡報、興趣台詞、提示訊息）也自動處理
    new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(walk)))
      .observe(document.body, { childList: true, subtree: true });
  }

  /* =================================================================
     8. 工作之外的 Mindy：點興趣卡片，Mindy 說一段話（文字在 js/data.js 的 hobbies）
     ================================================================= */
  function initHobbies() {
    const talk = $('#hobbyTalk'), text = $('#hobbyText');
    if (!talk) return;
    const lines = DATA.hobbies || {};
    let current = null;
    $$('.hobby-card').forEach(btn => btn.addEventListener('click', () => {
      const key = btn.dataset.hobby, same = current === key;
      $$('.hobby-card').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-expanded', 'false'); });
      if (same) { talk.hidden = true; current = null; return; }
      current = key;
      btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true');
      text.textContent = lines[key] || '';
      talk.hidden = false;
      talk.classList.remove('pop'); void talk.offsetWidth; talk.classList.add('pop');
    }));
  }

  /* =================================================================
     9. 背景音樂按鈕（音樂本身在 js/music.js）
     ================================================================= */
  function initMusic() {
    const btn = $('#musicBtn'), M = window.MindyMusic;
    if (!btn) return;
    if (!M || !M.supported) { btn.hidden = true; return; }
    const sync = () => {
      const on = M.isPlaying(), label = on ? '暫停背景音樂' : '播放背景音樂';
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-label', label);
      btn.title = label;
    };
    btn.addEventListener('click', () => { if (M.isPlaying()) M.pause(); else M.play(); sync(); });
    // 進入簡報模式：暫停音樂
    document.addEventListener('mindy:present', () => { M.pause(); sync(); });
    // 切換到其他分頁時暫停，回來後繼續
    let resume = false;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { resume = M.isPlaying(); if (resume) M.pause(); }
      else if (resume) { M.play(); resume = false; }
      sync();
    });
  }

  /* ---------- 依序啟動所有功能 ---------- */
  safe('導覽列', initNav);
  safe('探索地圖', initExplore);
  safe('作品卡片', initProjects);
  safe('合作互動', initConnect);
  safe('彩蛋', initEasterEggs);
  safe('簡報模式', initPresentation);
  safe('進場動畫', initReveal); // 最後啟動，才能包含動態產生的卡片
  safe('興趣台詞', initHobbies);
  safe('背景音樂', initMusic);
  safe('中文斷行', initWordBreak);
})();
