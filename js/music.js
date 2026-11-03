/* =====================================================================
   MINDY OS — 背景音樂（原創音樂盒旋律）
   ---------------------------------------------------------------------
   不使用任何音樂檔案：由瀏覽器的 Web Audio 即時「演奏」，
   旋律與和弦皆為原創，沒有版權問題，也不需要網路。

   - 預設不播放（瀏覽器規定：必須由訪客按下才能發出聲音）
   - 按右上角 ♪ 播放／暫停；進入簡報模式時會自動暫停
   - 想調整音量：改下方 VOLUME（0～1，建議 0.1～0.3）
   - 想調整速度：改下方 BPM（每分鐘拍數）
   ===================================================================== */
window.MindyMusic = (function () {
  'use strict';

  const VOLUME = 0.22;
  const BPM = 76;

  // 音名 → 頻率（以 A4 = 440Hz 計算）
  const NOTE = n => {
    const m = /^([A-G])(#?)(\d)$/.exec(n);
    const idx = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0);
    const midi = (parseInt(m[3], 10) + 1) * 12 + idx;
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  /* 原創旋律：8 小節循環，每小節 4 拍；[音名, 拍數]，null 為休止 */
  const MELODY = [
    ['E5', 1], ['G5', 1], ['E5', 1], ['D5', 1],
    ['C5', 1], ['E5', 1], ['A4', 2],
    ['F5', 1], ['E5', 1], ['D5', 1], ['C5', 1],
    ['D5', 2], ['B4', 1], ['G4', 1],
    ['E5', 1], ['G5', 1], ['C6', 1], ['B5', 1],
    ['G5', 1], ['E5', 1.5], [null, 0.5], ['D5', 1],
    ['C5', 1], ['D5', 1], ['E5', 1], ['F5', 1],
    ['D5', 2], [null, 1], ['G4', 1]
  ];
  /* 和弦（每小節一個）：C、Am、F、G、C、Em、F、G — 以八分音符分解和弦演奏 */
  const CHORDS = [
    ['C3', 'G3', 'C4', 'E4'], ['A2', 'E3', 'A3', 'C4'], ['F2', 'C3', 'F3', 'A3'], ['G2', 'D3', 'G3', 'B3'],
    ['C3', 'G3', 'C4', 'E4'], ['E2', 'B2', 'E3', 'G3'], ['F2', 'C3', 'F3', 'A3'], ['G2', 'D3', 'G3', 'B3']
  ];

  let ctx = null, master = null, reverb = null;
  let playing = false, timer = null, nextTime = 0, step = 0;
  const beat = 60 / BPM;

  function setup() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    // 柔和的殘響：用逐漸衰減的雜訊做成「空間感」
    reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.4, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    reverb.buffer = buf;
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    const tone = ctx.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 5200;
    master.connect(tone); tone.connect(ctx.destination);
    master.connect(reverb); reverb.connect(wet); wet.connect(ctx.destination);
    return true;
  }

  /* 一個音樂盒音色：主音＋高泛音，快速敲擊後自然衰減 */
  function bell(freq, time, dur, vel) {
    const partials = [[1, 1], [2, 0.32], [3.01, 0.12], [5.98, 0.05]];
    partials.forEach(([mult, amp]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq * mult;
      const peak = vel * amp;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(peak, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(2.6, dur + 1.4) / mult);
      o.connect(g); g.connect(master);
      o.start(time); o.stop(time + 3);
    });
  }

  // 依序排程：一次往前排 0.3 秒，讓節奏穩定
  const totalBeats = MELODY.reduce((s, n) => s + n[1], 0); // 32 拍
  const melodyStarts = []; { let t = 0; MELODY.forEach(n => { melodyStarts.push(t); t += n[1]; }); }

  function schedule() {
    while (nextTime < ctx.currentTime + 0.3) {
      const pos = step * 0.5;                 // 以八分音符為單位
      const bar = Math.floor(pos / 4) % 8, inBar = pos % 4;
      // 分解和弦（八分音符）：1-2-3-4-3-2-3-2 的起伏
      const chord = CHORDS[bar], order = [0, 1, 2, 3, 2, 1, 2, 1];
      bell(NOTE(chord[order[(inBar * 2) % 8]]), nextTime, beat * 0.5, 0.05);
      // 主旋律：在拍點上觸發
      const loopPos = pos % totalBeats;
      melodyStarts.forEach((st, i) => {
        if (Math.abs(st - loopPos) < 0.001 && MELODY[i][0]) bell(NOTE(MELODY[i][0]), nextTime, MELODY[i][1] * beat, 0.13);
      });
      nextTime += beat * 0.5;
      step++;
    }
  }

  /* iPhone：網頁音效預設會被「靜音開關」關掉。
     ① 支援的瀏覽器：把音訊類型設為「媒體播放」（和看影片一樣，靜音模式也會播）
     ② 舊版 iPhone：同時播放一段無聲音檔，讓系統切換成媒體播放模式 */
  let keepAlive = null;
  function silentAudio() {
    if (keepAlive) return keepAlive;
    const rate = 8000, n = rate / 2, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    const w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    w(36, 'data'); v.setUint32(40, n, true);
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
    keepAlive = new Audio(URL.createObjectURL(new Blob([buf], { type: 'audio/wav' })));
    keepAlive.loop = true;
    keepAlive.setAttribute('playsinline', '');
    return keepAlive;
  }

  function play() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* 不支援就略過 */ }
    try { const a = silentAudio(); const r = a.play(); if (r && r.catch) r.catch(() => {}); } catch (e) { /* 略過 */ }
    if (!ctx && !setup()) return false;
    if (ctx.state !== 'running') ctx.resume();
    if (playing) return true;
    playing = true;
    nextTime = ctx.currentTime + 0.1;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 1.2); // 淡入
    schedule();
    timer = setInterval(schedule, 100);
    return true;
  }

  function pause() {
    if (!ctx || !playing) return;
    playing = false;
    clearInterval(timer);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);       // 淡出
    setTimeout(() => { if (!playing && ctx) ctx.suspend(); if (!playing && keepAlive) keepAlive.pause(); }, 800);
  }

  return { play, pause, isPlaying: () => playing, supported: !!(window.AudioContext || window.webkitAudioContext) };
})();
