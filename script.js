document.getElementById("analyzeBtn").addEventListener("click", function () {
  const input = document.getElementById("prices").value.trim();
  const resultDiv = document.getElementById("result");

  if (input === "") {
    resultDiv.innerHTML = "⚠️ Please enter stock prices separated by commas.";
    return;
  }

  // Convert input to array of numbers
  const prices = input.split(",").map(x => Number(x.trim()));

  // Check for invalid or negative numbers
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
  } else {
    resultDiv.innerHTML = "📉 No profit can be made (prices are continuously decreasing).";
  }
});
