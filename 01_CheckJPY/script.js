// 7-day historical data via Fawaz Ahmed Currency API (free, CORS-friendly jsDelivr CDN)
// KEB Hana Bank's internal API (kebhana.com/cms/rate/wpfxd651_01i_01.do) requires
// server-side POST + auth — not accessible directly from a browser due to CORS.
const FAWAZ_LATEST = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json';
const FAWAZ_DATE   = d => `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/jpy.json`;
const HISTORY_DAYS = 7;

const C = {
  primary:  '#F97316',
  max:      '#2563EB',
  min:      '#16A34A',
  grid:     '#F1F5F9',
  axisText: '#94A3B8',
};

let weekData = [];

function dateString(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

async function loadWeekData() {
  const fetches = [];
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const ds  = dateString(i);
    const url = i === 0 ? FAWAZ_LATEST : FAWAZ_DATE(ds);
    fetches.push(
      fetch(url)
        .then(r => r.ok ? r.json() : null)
        .then(json => {
          if (!json?.jpy?.krw) return null;
          return { dateStr: ds, rate: parseFloat((json.jpy.krw * 100).toFixed(2)) };
        })
        .catch(() => null)
    );
  }
  const results = await Promise.all(fetches);
  weekData = results.filter(Boolean);
  return weekData.length > 0;
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = `status ${type}`;
}

function fmt(rate) {
  return rate.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateDisplay(rate, dateObj) {
  document.getElementById('rate-value').textContent = fmt(rate);
  document.getElementById('updated-time').textContent =
    `마지막 업데이트: ${dateObj.toLocaleString('ko-KR')}`;
}

// ── Refresh button ────────────────────────────────────────────────────────────

async function fetchRate() {
  const btn = document.getElementById('fetch-btn');
  btn.disabled = true;
  setStatus('불러오는 중...', 'loading');

  try {
    const ok = await loadWeekData();
    if (ok && weekData.length > 0) {
      const latest = weekData[weekData.length - 1];
      updateDisplay(latest.rate, new Date());
      drawGraph(weekData);
      setStatus('✅ 환율을 성공적으로 가져왔습니다.', 'success');
    } else {
      setStatus('❌ 데이터 가져오기 실패', 'error');
    }
  } catch (err) {
    console.error(err);
    setStatus('❌ 데이터 가져오기 실패', 'error');
  } finally {
    btn.disabled = false;
  }
}

// ── Graph ─────────────────────────────────────────────────────────────────────

function drawGraph(data) {
  const canvas = document.getElementById('rate-chart');
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  if (W === 0 || H === 0) return;

  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const pad = { top: 28, right: 94, bottom: 38, left: 58 };
  const pW  = W - pad.left - pad.right;
  const pH  = H - pad.top  - pad.bottom;
  const n   = HISTORY_DAYS;
  const colW = pW / n;

  // Column center X for index i (0 = oldest, n-1 = today)
  const toX = i => pad.left + colW * i + colW / 2;

  // Build slot array: HISTORY_DAYS entries oldest → today
  const slots = [];
  for (let i = HISTORY_DAYS - 1; i >= 0; i--) slots.push(dateString(i));

  // ── Day grid (vertical lines between columns) ──────────────
  const drawDayGrid = () => {
    ctx.setLineDash([]);
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= n; i++) {
      const x = pad.left + colW * i;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + pH);
      ctx.stroke();
    }
  };

  // ── X-axis date labels ──────────────────────────────────────
  const drawXLabels = () => {
    ctx.font = '10px DM Sans, sans-serif';
    ctx.fillStyle = C.axisText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const todayStr = dateString(0);
    for (let i = 0; i < n; i++) {
      const ds = slots[i];
      let label;
      if (ds === todayStr) {
        label = '오늘';
      } else {
        const d = new Date(ds + 'T00:00:00');
        label = `${d.getMonth() + 1}/${d.getDate()}`;
      }
      ctx.fillText(label, toX(i), pad.top + pH + 6);
    }
  };

  // ── No-data state ───────────────────────────────────────────
  if (data.length === 0) {
    drawDayGrid();
    drawXLabels();
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('환율 데이터를 불러오는 중...', W / 2, pad.top + pH / 2);
    return;
  }

  // Map data by dateStr
  const byDate = {};
  for (const d of data) byDate[d.dateStr] = d.rate;

  // Y domain
  const rates   = data.map(d => d.rate);
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);
  const span    = Math.max(maxRate - minRate, 5);
  const yPad    = span * 0.4;
  const yMin    = minRate - yPad;
  const yMax    = maxRate + yPad;
  const toY     = r => pad.top + ((yMax - r) / (yMax - yMin)) * pH;

  drawDayGrid();

  // ── Y grid + labels ─────────────────────────────────────────
  const yTickCount = 4;
  for (let i = 0; i <= yTickCount; i++) {
    const r = yMin + (i / yTickCount) * (yMax - yMin);
    const y = toY(r);
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + pW, y);
    ctx.stroke();

    ctx.fillStyle = C.axisText;
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(r.toFixed(0), pad.left - 6, y);
  }

  // Collect points in slot order (skip missing dates)
  const points = [];
  for (let i = 0; i < n; i++) {
    const ds = slots[i];
    if (byDate[ds] !== undefined) {
      points.push({ x: toX(i), y: toY(byDate[ds]), rate: byDate[ds], dateStr: ds });
    }
  }

  if (points.length === 0) { drawXLabels(); return; }

  // ── Area fill ───────────────────────────────────────────────
  if (points.length > 1) {
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + pH);
    grad.addColorStop(0, 'rgba(249,115,22,0.15)');
    grad.addColorStop(1, 'rgba(249,115,22,0.01)');
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.lineTo(points[points.length - 1].x, pad.top + pH);
    ctx.lineTo(points[0].x, pad.top + pH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ── Line ────────────────────────────────────────────────────
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.strokeStyle = C.primary;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // ── Dots ────────────────────────────────────────────────────
  const todayStr = dateString(0);
  for (const p of points) {
    const isToday = p.dateStr === todayStr;
    ctx.beginPath();
    ctx.arc(p.x, p.y, isToday ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle   = isToday ? C.primary : '#fff';
    ctx.strokeStyle = C.primary;
    ctx.lineWidth   = 1.5;
    ctx.fill();
    if (!isToday) ctx.stroke();
  }

  // ── Max / Min dashed lines ──────────────────────────────────
  const ratesVary = maxRate !== minRate;
  if (ratesVary) {
    const drawDash = (y, color) => {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pW, y);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    drawDash(toY(maxRate), C.max);
    drawDash(toY(minRate), C.min);
  }

  // ── Right-side labels ───────────────────────────────────────
  const currentRate = points[points.length - 1].rate;
  const labelX = pad.left + pW + 8;
  const labels = [];

  if (ratesVary && points.length > 1) {
    labels.push({ y: toY(maxRate),     text: `최고 ${fmt(maxRate)}`,     color: C.max     });
    labels.push({ y: toY(minRate),     text: `최저 ${fmt(minRate)}`,     color: C.min     });
    if (Math.abs(currentRate - maxRate) > 0.5 && Math.abs(currentRate - minRate) > 0.5) {
      labels.push({ y: toY(currentRate), text: `현재 ${fmt(currentRate)}`, color: C.primary });
    }
  } else {
    labels.push({ y: toY(currentRate), text: `현재 ${fmt(currentRate)}`, color: C.primary });
  }

  labels.sort((a, b) => a.y - b.y);
  const GAP = 16;
  for (let i = 1; i < labels.length; i++) {
    if (labels[i].y - labels[i - 1].y < GAP) labels[i].y = labels[i - 1].y + GAP;
  }
  for (const lb of labels) {
    lb.y = Math.max(pad.top + 6, Math.min(lb.y, pad.top + pH - 6));
  }

  ctx.font = '500 11px DM Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (const lb of labels) {
    ctx.fillStyle = lb.color;
    ctx.fillText(lb.text, labelX, lb.y);
  }

  drawXLabels();
}

// ── Init ──────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', async () => {
  drawGraph([]);

  const ok = await loadWeekData();
  if (ok && weekData.length > 0) {
    const latest = weekData[weekData.length - 1];
    updateDisplay(latest.rate, new Date());
    drawGraph(weekData);
  } else {
    setStatus('📡 환율 기록 로드 실패 — 새로고침 버튼을 눌러주세요', 'error');
  }
});

window.addEventListener('resize', () => drawGraph(weekData));
