// Divide & Conquer Maximum Subarray Algorithm for Stock Market Analyzer

// ----- Helper Functions -----
function maxCrossing(arr, left, mid, right) {
  let leftSum = -Infinity, rightSum = -Infinity;
  let sum = 0, maxLeft = mid, maxRight = mid + 1;

  for (let i = mid; i >= left; i--) {
    sum += arr[i];
    if (sum > leftSum) {
      leftSum = sum;
      maxLeft = i;
    }
  }

  sum = 0;
  for (let j = mid + 1; j <= right; j++) {
    sum += arr[j];
    if (sum > rightSum) {
      rightSum = sum;
      maxRight = j;
    }
  }

  return { maxSum: leftSum + rightSum, leftIdx: maxLeft, rightIdx: maxRight };
}

function maxSubarrayDC(arr, left = 0, right = arr.length - 1) {
  if (left === right) {
    return { maxSum: arr[left], leftIdx: left, rightIdx: left };
  }

  const mid = Math.floor((left + right) / 2);
  const leftRes = maxSubarrayDC(arr, left, mid);
  const rightRes = maxSubarrayDC(arr, mid + 1, right);
  const crossRes = maxCrossing(arr, left, mid, right);

  let best = leftRes;
  if (rightRes.maxSum > best.maxSum) best = rightRes;
  if (crossRes.maxSum > best.maxSum) best = crossRes;

  return best;
}

// ----- Chart.js Helper -----
let globalChart = null;
function renderChart(prices, buyIdx, sellIdx) {
  const ctx = document.getElementById('stockChart').getContext('2d');

  const highlight = prices.map((v, i) =>
    i >= buyIdx && i <= sellIdx ? v : null
  );

  if (globalChart) globalChart.destroy();

  globalChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: prices.map((_, i) => 'Day ' + (i + 1)),
      datasets: [
        {
          label: 'Stock Prices',
          data: prices,
          borderColor: '#6a1b9a',
          borderWidth: 2,
          fill: false,
          tension: 0.2
        },
        {
          label: 'Best Period',
          data: highlight,
          borderColor: '#388e3c',
          borderWidth: 3,
          pointRadius: 4,
          tension: 0.2
        }
      ]
    }
  });
}

// ----- Main Program -----
document.getElementById('analyzeButton').addEventListener('click', function () {
  const input = document.getElementById('prices').value.trim();
  const resultDiv = document.getElementById('result');

  if (globalChart) { globalChart.destroy(); globalChart = null; }

  if (input === '') {
    resultDiv.innerHTML = '⚠️ Please enter stock prices separated by commas.';
    return;
  }

  const prices = input.split(',').map(s => Number(s.trim()));

  if (prices.some(isNaN)) {
    resultDiv.innerHTML = '⚠️ Please enter valid numeric prices.';
    return;
  }

  if (prices.some(p => p < 0)) {
    resultDiv.innerHTML = '⚠️ Stock prices cannot be negative.';
    return;
  }

  if (prices.length < 2) {
    resultDiv.innerHTML = 'ℹ️ Need at least two days to analyze.';
    renderChart(prices, null, null);
    return;
  }

  // Create array of daily changes
  const diffs = [];
  for (let i = 0; i < prices.length - 1; i++) {
    diffs.push(prices[i + 1] - prices[i]);
  }

  const res = maxSubarrayDC(diffs, 0, diffs.length - 1);

  if (res.maxSum <= 0) {
    resultDiv.innerHTML = '📉 No profitable interval found.';
    renderChart(prices, null, null);
    return;
  }

  const buyIdx = res.leftIdx;
  const sellIdx = res.rightIdx + 1;

  const profit = res.maxSum;
  const holdingPeriod = sellIdx - buyIdx;
  const stocksInPeriod = prices.slice(buyIdx, sellIdx + 1);

  resultDiv.innerHTML = `
    ✅ <b>Maximum Profit:</b> ₹${profit.toFixed(2)}<br>
    📈 <b>Buy on Day:</b> ${buyIdx + 1} (₹${prices[buyIdx]})<br>
    💰 <b>Sell on Day:</b> ${sellIdx + 1} (₹${prices[sellIdx]})<br>
    ⏳ <b>Holding Period:</b> ${holdingPeriod} day${holdingPeriod > 1 ? 's' : ''}<br>
    📊 <b>Stock Prices in that period:</b> [${stocksInPeriod.join(', ')}]
  `;

  renderChart(prices, buyIdx, sellIdx);
});
