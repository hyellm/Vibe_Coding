// API endpoint: returns latest exchange rates with JPY as the base currency
const API_URL = 'https://api.exchangerate-api.com/v4/latest/JPY';

async function fetchRate() {
  const btn = document.getElementById('fetch-btn');
  const rateValue = document.getElementById('rate-value');
  const updatedTime = document.getElementById('updated-time');
  const status = document.getElementById('status');

  // --- Loading state ---
  btn.disabled = true;
  status.textContent = '불러오는 중...';
  status.className = 'status loading';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Extract the KRW rate (1 JPY = X KRW), then scale to 100 JPY
    const krwPer1Jpy = data.rates.KRW;
    const krwPer100Jpy = (krwPer1Jpy * 100).toFixed(2);

    // Update rate display
    rateValue.textContent = Number(krwPer100Jpy).toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Update timestamp
    const now = new Date();
    const timeString = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    updatedTime.textContent = `마지막 업데이트: ${timeString}`;

    // --- Success state ---
    status.textContent = '✅ 환율을 성공적으로 가져왔습니다.';
    status.className = 'status success';
  } catch (error) {
    // --- Error state ---
    console.error('환율 요청 실패:', error);
    status.textContent = '❌ 데이터 가져오기 실패';
    status.className = 'status error';
  } finally {
    btn.disabled = false;
  }
}
