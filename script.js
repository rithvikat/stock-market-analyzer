document.getElementById('mode').addEventListener('change', function () {
  document.getElementById('daily-section').style.display = this.value === 'daily' ? 'block' : 'none';
  document.getElementById('shares-section').style.display = this.value === 'shares' ? 'block' : 'none';
  document.getElementById('output').innerHTML = "";
  document.getElementById('chart').style.display = "none";
});

// Divide and Conquer to find maximum subarray (max profit)
function maxSubArray(arr, low, high) {
  if (low === high) return { sum: arr[low], start: low, end: high };

  let mid = Math.floor((low + high) / 2);
  let left = maxSubArray(arr, low, mid);
  let right = maxSubArray(arr, mid + 1, high);
  let cross = maxCrossingSubArray(arr, low, mid, high);

  if (left.sum >= right.sum && left.sum >= cross.sum) return left;
  else if (right.sum >= left.sum && right.sum >= cross.sum) return right;
  else return cross;
}

function maxCrossingSubArray(arr, low, mid, high) {
  let leftSum = -Infinity, sum = 0, maxLeft = mid;
  for (let i = mid; i >= low; i--) {
    sum += arr[i];
    if (sum > leftSum) { leftSum = sum; maxLeft = i; }
  }
  let rightSum = -Infinity; sum = 0; let maxRight = mid + 1;
  for (let j = mid + 1; j <= high; j++) {
    sum += arr[j];
    if (sum > rightSum) { rightSum = sum; maxRight = j; }
  }
  return { sum: leftSum + rightSum, start: maxLeft, end: maxRight };
}

function analyzeDaily() {
  const prices = document.getElementById('prices').value.split(',').map(Number);
  const diffs = [];
  for (let i = 1; i < prices.length; i++) diffs.push(prices[i] - prices[i - 1]);

  const result = maxSubArray(diffs, 0, diffs.length - 1);
  const buyDay = result.start + 1;
  const sellDay = result.end + 1;
  const maxProfit = result.sum;
  const holdingPeriod = sellDay - buyDay;
  const priceRange = prices.slice(buyDay, sellDay + 1);

  showResults(prices, buyDay, sellDay, maxProfit, holdingPeriod, priceRange);
}

function analyzeShares() {
  const prices = document.getElementById('sharesPrices').value.split(',').map(Number);
  const diffs = [];
  for (let i = 1; i < prices.length; i++) diffs.push(prices[i] - prices[i - 1]);

  const result = maxSubArray(diffs, 0, diffs.length - 1);
  const buyDay = result.start + 1;
  const sellDay = result.end + 1;
  const maxProfit = result.sum;
  const holdingPeriod = sellDay - buyDay;
  const priceRange = prices.slice(buyDay, sellDay + 1);

  showResults(prices, buyDay, sellDay, maxProfit, holdingPeriod, priceRange);
}

function showResults(prices, buyDay, sellDay, maxProfit, holdingPeriod, priceRange) {
  const output = document.getElementById('output');
  output.innerHTML = `
    <p>💵 <b>Maximum Profit:</b> ${maxProfit}</p>
    <p>🛒 <b>Best Day to Buy:</b> Day ${buyDay} (Price: ${prices[buyDay]})</p>
    <p>💰 <b>Best Day to Sell:</b> Day ${sellDay} (Price: ${prices[sellDay]})</p>
    <p>⏳ <b>Holding Period:</b> ${holdingPeriod} days</p>
    <p>📊 <b>Stock Prices in that period:</b> [${priceRange.join(', ')}]</p>
  `;
  plotChart(prices, buyDay, sellDay);
}

function plotChart(prices, buyDay, sellDay) {
  const ctx = document.getElementById('chart');
  ctx.style.display = "block";
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: prices.map((_, i) => `Day ${i}`),
      datasets: [{
        label: 'Stock Prices',
        data: prices,
        borderColor: '#6b1e9a',
        borderWidth: 2,
        pointBackgroundColor: prices.map((_, i) =>
          i === buyDay ? 'green' : i === sellDay ? 'red' : '#6b1e9a'
        ),
        tension: 0.3,
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: false } }
    }
  });
}

