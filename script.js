let chartInstance = null;

function switchMode(mode) {
  document.getElementById("singleMode").classList.add("hidden");
  document.getElementById("multiMode").classList.add("hidden");
  if (chartInstance) chartInstance.destroy();
  document.getElementById("stockChart").style.display = "none";
  if (mode === "single") {
    document.getElementById("singleMode").classList.remove("hidden");
  } else {
    document.getElementById("multiMode").classList.remove("hidden");
  }
}

// Divide & Conquer Maximum Subarray (for profit)
function maxCrossingSum(arr, l, m, h) {
  let sum = 0;
  let left_sum = -Infinity,
    right_sum = -Infinity;
  let buyIndex = m,
    sellIndex = m + 1;

  for (let i = m; i >= l; i--) {
    sum += arr[i];
    if (sum > left_sum) {
      left_sum = sum;
      buyIndex = i;
    }
  }

  sum = 0;
  for (let i = m + 1; i <= h; i++) {
    sum += arr[i];
    if (sum > right_sum) {
      right_sum = sum;
      sellIndex = i;
    }
  }
  return { sum: left_sum + right_sum, buy: buyIndex, sell: sellIndex };
}

function maxSubArraySum(arr, l, h) {
  if (l === h) return { sum: arr[l], buy: l, sell: h };
  let m = Math.floor((l + h) / 2);

  let left = maxSubArraySum(arr, l, m);
  let right = maxSubArraySum(arr, m + 1, h);
  let cross = maxCrossingSum(arr, l, m, h);

  if (left.sum >= right.sum && left.sum >= cross.sum) return left;
  else if (right.sum >= left.sum && right.sum >= cross.sum) return right;
  else return cross;
}

function analyzeSingle() {
  const name = document.getElementById("singleName").value.trim();
  const prices = document.getElementById("singlePrices").value.split(",").map(Number);
  if (prices.length < 2) {
    alert("Enter at least two prices.");
    return;
  }

  const changes = [];
  for (let i = 1; i < prices.length; i++) changes.push(prices[i] - prices[i - 1]);

  const result = maxSubArraySum(changes, 0, changes.length - 1);
  const buyDay = result.buy;
  const sellDay = result.sell + 1;
  const buyPrice = prices[buyDay];
  const sellPrice = prices[sellDay];
  const profit = sellPrice - buyPrice;

  document.getElementById("resultSingle").innerText = 
    `📈 Stock: ${name}\n💰 Maximum Profit: ₹${profit}\n🛒 Buy at: ₹${buyPrice} (Day ${buyDay + 1})\n🏷️ Sell at: ₹${sellPrice} (Day ${sellDay + 1})\n⏳ Holding Period: ${sellDay - buyDay} days`;

  drawChart(prices, name, buyDay, sellDay);
}

function analyzeMultiple() {
  const lines = document.getElementById("multiStocks").value.trim().split("\n");
  let bestProfit = 0,
    bestStock = "";
  let results = [];
  let datasets = [];
  let colors = ["#00ffc6", "#ff5f5f", "#59a6ff", "#ffe45e", "#ad7bff"];

  lines.forEach((line, idx) => {
    if (!line.includes(":")) return;
    const [name, arr] = line.split(":");
    const prices = arr.split(",").map(Number);
    const changes = [];
    for (let i = 1; i < prices.length; i++) changes.push(prices[i] - prices[i - 1]);

    const result = maxSubArraySum(changes, 0, changes.length - 1);
    const buyDay = result.buy;
    const sellDay = result.sell + 1;
    const buyPrice = prices[buyDay];
    const sellPrice = prices[sellDay];
    const profit = sellPrice - buyPrice;

    results.push(
      `${name.trim()} → ₹${profit} (Buy ₹${buyPrice} → Sell ₹${sellPrice}, Period: ${sellDay - buyDay} days)`
    );

    if (profit > bestProfit) {
      bestProfit = profit;
      bestStock = name.trim();
    }

    datasets.push({
      label: name.trim(),
      data: prices,
      borderColor: colors[idx % colors.length],
      fill: false,
      tension: 0.2,
    });
  });

  document.getElementById("resultMulti").innerText =
    results.join("\n") + `\n\n🏆 Best Performer: ${bestStock}`;
  drawMultiChart(datasets);
}

function drawChart(prices, name, buyDay, sellDay) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();
  document.getElementById("stockChart").style.display = "block";
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: prices.map((_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: name,
          data: prices,
          borderColor: "#00ffc6",
          fill: false,
          tension: 0.3,
          pointBackgroundColor: prices.map((_, i) =>
            i === buyDay ? "#00ff00" : i === sellDay ? "#ff3333" : "#ffffff"
          ),
          pointRadius: prices.map((_, i) =>
            i === buyDay || i === sellDay ? 7 : 3
          ),
        },
      ],
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } },
        title: { display: true, text: "Price Movement", color: "#00ffc6" },
      },
      scales: {
        x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
        y: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
      },
    },
  });
}

function drawMultiChart(datasets) {
  const ctx = document.getElementById("stockChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();
  document.getElementById("stockChart").style.display = "block";
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: datasets[0].data.map((_, i) => `Day ${i + 1}`),
      datasets,
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } },
        title: {
          display: true,
          text: "Multiple Stocks Comparison",
          color: "#00ffc6",
        },
      },
      scales: {
        x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
        y: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
      },
    },
  });
}
