const API_URL     = 'https://api.exchangerate-api.com/v4/latest/JPY';
const STORAGE_KEY = 'jpy_krw_history';

// CreateSpace design tokens
const C = {
  primary:  '#F97316',  // orange — current rate, line, button
  max:      '#2563EB',  // blue   — highest
  min:      '#16A34A',  // green  — lowest
  grid:     '#F1F5F9',
  axisText: '#94A3B8',
};

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadTodayData() {
  const todayStr = new Date().toDateString();
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return all.filter(e => new Date(e.time).toDateString() === todayStr);
  } catch {
    return [];
  }
}

function saveDataPoint(rate) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    all.push({ time: new Date().toISOString(), rate });
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(
      all.filter(e => new Date(e.time).getTime() > cutoff)
    ));
  } catch (e) {
    console.warn('localStorage error:', e);
  }
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = `status ${type}`;
}

function fmt(rate) {
  return rate.toLocaleString('ko-KR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function updateDisplay(rate, dateObj) {
  document.getElementById('rate-value').textContent = fmt(rate);
  document.getElementById('updated-time').textContent =
    `마지막 업데이트: ${dateObj.toLocaleString('ko-KR')}`;
}

// ── Fetch ─────────────────────────────────────────────────────────────────────

// silent = true: no status messages (used for auto-fetch on load)
async function fetchRate(silent = false) {
  const btn = document.getElementById('fetch-btn');
  btn.disabled = true;
  if (!silent) setStatus('불러오는 중...', 'loading');

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    const rate = parseFloat((json.rates.KRW * 100).toFixed(2));
    const now  = new Date();

    saveDataPoint(rate);
    updateDisplay(rate, now);
    drawGraph(loadTodayData());

    if (!silent) setStatus('✅ 환율을 성공적으로 가져왔습니다.', 'success');
  } catch (err) {
    console.error(err);
    if (!silent) {
      setStatus('❌ 데이터 가져오기 실패', 'error');
    } else {
      // Silent fail: still draw whatever data we have
      drawGraph(loadTodayData());
    }
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

  // X domain: today 00:00 → now + 1 hour
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const xMin   = todayStart.getTime();
  const xMax   = Date.now() + 60 * 60 * 1000;
  const xRange = xMax - xMin;
  const HOUR   = 60 * 60 * 1000;

  const toX = t => pad.left + ((t - xMin) / xRange) * pW;

  // Hourly tick marks
  const ticks = [];
  for (let t = xMin; t <= xMax; t += HOUR) ticks.push(t);
  const totalHours = Math.floor(xRange / HOUR);
  const labelEvery = totalHours <= 8 ? 1 : totalHours <= 16 ? 2 : 3;

  // Helper: draw vertical hour grid lines
  const drawHourGrid = () => {
    ctx.setLineDash([]);
    ctx.strokeStyle = C.grid;
    ctx.lineWidth = 1;
    for (const tick of ticks) {
      ctx.beginPath();
      ctx.moveTo(toX(tick), pad.top);
      ctx.lineTo(toX(tick), pad.top + pH);
      ctx.stroke();
    }
  };

  // Helper: draw X-axis hour labels
  const drawXLabels = () => {
    ctx.font = '10px DM Sans, sans-serif';
    ctx.fillStyle = C.axisText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ticks.forEach((tick, i) => {
      if (i % labelEvery === 0) {
        const h = String(new Date(tick).getHours()).padStart(2, '0');
        ctx.fillText(`${h}:00`, toX(tick), pad.top + pH + 6);
      }
    });
  };

  // ── No-data state ──────────────────────────────────────────
  if (data.length === 0) {
    drawHourGrid();
    drawXLabels();
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '13px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('불러오는 중...', W / 2, pad.top + pH / 2);
    return;
  }

  // Y domain
  const rates   = data.map(d => d.rate);
  const times   = data.map(d => new Date(d.time).getTime());
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);
  const span    = Math.max(maxRate - minRate, 10);
  const yPad    = span * 0.35;
  const yMin    = minRate - yPad;
  const yMax    = maxRate + yPad;

  const toY = r => pad.top + ((yMax - r) / (yMax - yMin)) * pH;

  // ── Vertical hour grid ──────────────────────────────────────
  drawHourGrid();

  // ── Horizontal Y grid + labels ──────────────────────────────
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

  // ── Area fill (only for ≥2 points) ─────────────────────────
  if (data.length > 1) {
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + pH);
    grad.addColorStop(0, 'rgba(249,115,22,0.15)');
    grad.addColorStop(1, 'rgba(249,115,22,0.01)');
    ctx.beginPath();
    ctx.moveTo(toX(times[0]), toY(rates[0]));
    for (let i = 1; i < data.length; i++) ctx.lineTo(toX(times[i]), toY(rates[i]));
    ctx.lineTo(toX(times[times.length - 1]), pad.top + pH);
    ctx.lineTo(toX(times[0]), pad.top + pH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ── Line ────────────────────────────────────────────────────
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(toX(times[0]), toY(rates[0]));
  for (let i = 1; i < data.length; i++) ctx.lineTo(toX(times[i]), toY(rates[i]));
  ctx.strokeStyle = C.primary;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // ── Dots ────────────────────────────────────────────────────
  for (let i = 0; i < data.length; i++) {
    const x = toX(times[i]);
    const y = toY(rates[i]);
    const isLast = i === data.length - 1;
    ctx.beginPath();
    ctx.arc(x, y, isLast ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle   = isLast ? C.primary : '#fff';
    ctx.strokeStyle = C.primary;
    ctx.lineWidth   = 2;
    ctx.fill();
    ctx.stroke();
  }

  // ── Max / Min dashed reference lines ───────────────────────
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

  // ── Right-side labels (with collision avoidance) ────────────
  const currentRate = rates[rates.length - 1];
  const labelX = pad.left + pW + 8;

  const labels = [];
  if (ratesVary && data.length > 1) {
    labels.push({ y: toY(maxRate),     text: `최고 ${fmt(maxRate)}`,     color: C.max  });
    labels.push({ y: toY(minRate),     text: `최저 ${fmt(minRate)}`,     color: C.min  });
    // Show current only when it differs meaningfully from max and min
    if (Math.abs(currentRate - maxRate) > 0.5 && Math.abs(currentRate - minRate) > 0.5) {
      labels.push({ y: toY(currentRate), text: `현재 ${fmt(currentRate)}`, color: C.primary });
    }
  } else {
    labels.push({ y: toY(currentRate), text: `현재 ${fmt(currentRate)}`, color: C.primary });
  }

  // Sort top → bottom, then push down overlapping labels
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

  // ── X-axis hour labels ──────────────────────────────────────
  drawXLabels();
}

// ── Init ──────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  // Show cached data immediately so there's no blank flash
  const cached = loadTodayData();
  if (cached.length > 0) {
    const latest = cached[cached.length - 1];
    updateDisplay(latest.rate, new Date(latest.time));
  }
  drawGraph(cached);

  // Silently fetch the latest rate in the background
  fetchRate(true);
});

window.addEventListener('resize', () => drawGraph(loadTodayData()));
