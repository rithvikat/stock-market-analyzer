document.getElementById("analyzeBtn").addEventListener("click", function () {
  const input = document.getElementById("prices").value.trim();
  const resultDiv = document.getElementById("result");
  const chartCanvas = document.getElementById("stockChart");

  // Clear previous chart
  if (window.stockChartInstance) {
    window.stockChartInstance.destroy();
  }

  if (input === "") {
    resultDiv.innerHTML = "⚠️ Please enter stock prices separated by commas.";
    return;
  }

  // Convert input to array of numbers
  const prices = input.split(",").map(x => Number(x.trim()));

  // Validate input
  if (prices.some(isNaN)) {
    resultDiv.innerHTML = "⚠️ Please enter valid numbers only.";
    return;
  }

  if (prices.some(p => p < 0)) {
    resultDiv.innerHTML = "⚠️ Stock prices cannot be negative.";
    return;
  }

  // Find maximum profit
  let minPrice = prices[0];
  let maxProfit = 0;
  let buyDay = 0;
  let sellDay = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] - minPrice > maxProfit) {
      maxProfit = prices[i] - minPrice;
      sellDay = i;
      buyDay = prices.indexOf(minPrice);
    }
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    }
  }

  // Display result
  if (maxProfit > 0) {
    const period = sellDay - buyDay;
    const stocksInPeriod = prices.slice(buyDay, sellDay + 1);

    resultDiv.innerHTML = `
      ✅ <b>Maximum Profit:</b> ₹${maxProfit}<br>
      📈 <b>Buy on Day:</b> ${buyDay + 1} (₹${prices[buyDay]})<br>
      💰 <b>Sell on Day:</b> ${sellDay + 1} (₹${prices[sellDay]})<br>
      ⏳ <b>Holding Period:</b> ${period} day${period > 1 ? 's' : ''}<br>
      📊 <b>Stock Prices in that period:</b> [${stocksInPeriod.join(", ")}]
    `;

    // Draw Chart
    const ctx = chartCanvas.getContext("2d");
    window.stockChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: prices.map((_, i) => "Day " + (i + 1)),
        datasets: [{
          label: "Stock Prices",
          data: prices,
          borderColor: "blue",
          backgroundColor: "rgba(0,0,255,0.1)",
          fill: true,
          pointRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          x: { title: { display: true, text: "Day" } },
          y: { title: { display: true, text: "Price (₹)" } }
        },
        plugins: {
          title: {
            display: true,
            text: "Stock Price Movement"
          }
        }
      }
    });

  } else {
    resultDiv.innerHTML = "📉 No profit can be made (prices are continuously decreasing).";
  }
});
