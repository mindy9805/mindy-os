/**
 * MINDY OS — 合作意願表單收件程式（Google Apps Script）
 * ------------------------------------------------------------
 * 用途：接收網站「我們可以一起創造什麼？」送出的資料，
 *       自動寫進這份 Google 試算表。
 *
 * 使用方式：請照 docs/表單設定教學.md 操作，整段複製貼上即可，不需修改。
 *
 * 會自動建立兩個工作表：
 *   「合作意願」：每送出一次就新增一列（時間、名字、專長、其他專長、留言、來源）
 *   「統計」　　：自動計算總人數與各專長人數
 */

const SHEET_NAME = '合作意願';
const STATS_NAME = '統計';
const SKILLS = ['UI/UX 與視覺設計', '程式與系統開發', '品牌與行銷', '資料分析', '企劃與專案管理', '其他領域'];

/** 網站送出資料時會執行這裡 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // 避免多人同時送出時資料互相覆蓋
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return reply_({ ok: true }); // 防垃圾訊息欄位有值 → 忽略

    const name = clean_(data.name, 30);
    const skills = Array.isArray(data.skills) ? data.skills.map(function (s) { return clean_(s, 30); }) : [];
    if (!name || !skills.length) return reply_({ ok: false, error: 'missing fields' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getSheet_(ss);
    sheet.appendRow([
      new Date(),
      name,
      skills.join('、'),
      clean_(data.other, 30),
      clean_(data.message, 200),
      clean_(data.source, 10)
    ]);
    ensureStats_(ss);
    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** 在瀏覽器打開網址時顯示，用來確認部署成功 */
function doGet() {
  return ContentService.createTextOutput('MINDY OS 表單收件程式運作中 ✓');
}

/** 第一次設定時可手動執行一次：先建立工作表與統計表 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  getSheet_(ss);
  ensureStats_(ss);
}

function getSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['時間', '名字', '專長', '其他專長', '留言', '來源']);
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('yyyy/mm/dd hh:mm');
  }
  return sheet;
}

function ensureStats_(ss) {
  if (ss.getSheetByName(STATS_NAME)) return;
  const st = ss.insertSheet(STATS_NAME);
  st.appendRow(['項目', '人數']);
  st.appendRow(['總填寫數', "=MAX(COUNTA('" + SHEET_NAME + "'!B:B)-1,0)"]);
  SKILLS.forEach(function (s) {
    st.appendRow([s, "=COUNTIF('" + SHEET_NAME + "'!C:C,\"*" + s + "*\")"]);
  });
  st.setFrozenRows(1);
}

/** 清理文字：限制長度，並避免以 = + - @ 開頭被試算表當成公式 */
function clean_(value, max) {
  let s = String(value == null ? '' : value).trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
