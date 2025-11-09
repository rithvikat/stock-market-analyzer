// ---------- Divide & Conquer Functions ----------
function findMaxCrossingProfit(prices, left, mid, right) {
  let leftSum = -Infinity, rightSum = -Infinity;
  let sum = 0, minDay = mid, maxDay = mid + 1;

  for (let i = mid; i >= left; i--) {
    sum += prices[i];
    if (sum > leftSum) {
      leftSum = sum;
      minDay = i;
    }
  }

  sum = 0;
  for (let i = mid + 1; i <= right; i++) {
    sum += prices[i];
    if (sum > rightSum) {
      rightSum = sum;
      maxDay = i;
    }
  }

  return { profit: leftSum + rightSum, buy: minDay, sell: maxDay };
}

function findMaxProfit(prices, left, right) {
  if (left === right) return { profit: prices[left], buy: left, sell: right };
  let mid = Math.floor((left + right) / 2);

  let leftResult = findMaxProfit(prices, left, mid);
  let rightResult = findMaxProfit(prices, mid + 1, right);
  let crossResult = findMaxCrossingProfit(prices, left, mid, right);

  if (leftResult.profit >= rightResult.profit && leftResult.profit >= crossResult.profit) return leftResult;
  else if (rightResult.profit >= leftResult.profit && rightResult.profit >= crossResult.profit) return rightResult;
  else return crossResult;
}

// ---------- Daily Prices ----------
document.getElementById("generate").addEventListener("click", () => {
  const days = parseInt(document.getElementById("days").value);
  const container = document.getElementById("price-inputs");
  container.innerHTML = "";

  if (days < 2) {
    alert("Please enter at least 2 days!");
    return;
  }

  for (let i = 1; i <= days; i++) {
    const div = document.createElement("div");
    div.innerHTML = `Day ${i} Price: ₹ <input type="number" id="price${i}" required>`;
    container.appendChild(div);
  }

  document.getElementById("analyze").style.display = "inline-block";
});

document.getElementById("analyze").addEventListener("click", () => {
  const stockName = document.getElementById("stock").value.trim();
  const days = parseInt(document.getElementById("days").value);
  let prices = [];

  if (!stockName) return alert("Please enter stock name!");

  for (let i = 1; i <= days; i++) {
    let val = parseFloat(document.getElementById(`price${i}`).value);
    if (isNaN(val)) return alert(`Enter valid price for day ${i}`);
    prices.push(val);
  }

  let changes = [];
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  let result = findMaxProfit(changes, 0, changes.length - 1);
  const holdingPeriod = result.sell - result.buy + 1;

  document.getElementById("output").innerHTML = `
    <h3>📊 Result for <span style="color:#00e6ff">${stockName}</span></h3>
    <p><b>Maximum Profit:</b> ₹${result.profit.toFixed(2)}</p>
    <p><b>Holding Period:</b> ${holdingPeriod} days</p>
  `;
});

// ---------- Multiple Shares ----------
document.getElementById("generateStocks").addEventListener("click", () => {
  const numStocks = parseInt(document.getElementById("numStocks").value);
  const container = document.getElementById("multi-inputs");
  container.innerHTML = "";

  if (numStocks < 1) {
    alert("Please enter at least 1 stock!");
    return;
  }

  for (let i = 1; i <= numStocks; i++) {
    const section = document.createElement("div");
    section.classList.add("stock-box");
    section.innerHTML = `
      <h4>📈 Stock ${i}</h4>
      <label>Enter Stock Name:</label>
      <input type="text" id="stockName${i}" placeholder="e.g., Infosys">
      <label>Enter Number of Days:</label>
      <input type="number" id="days${i}" placeholder="e.g., 5" min="2">
      <button onclick="generateStockPrices(${i})">Add Prices</button>
      <div id="priceContainer${i}"></div>
    `;
    container.appendChild(section);
  }

  document.getElementById("analyzeMulti").style.display = "inline-block";
});

function generateStockPrices(i) {
  const days = parseInt(document.getElementById(`days${i}`).value);
  const container = document.getElementById(`priceContainer${i}`);
  container.innerHTML = "";

  if (days < 2) {
    alert("Please enter at least 2 days!");
    return;
  }

  for (let j = 1; j <= days; j++) {
    const div = document.createElement("div");
    div.innerHTML = `Day ${j} Price: ₹ <input type="number" id="stock${i}price${j}" required>`;
    container.appendChild(div);
  }
}

document.getElementById("analyzeMulti").addEventListener("click", () => {
  const numStocks = parseInt(document.getElementById("numStocks").value);
  let results = [];

  for (let i = 1; i <= numStocks; i++) {
    const stockName = document.getElementById(`stockName${i}`).value.trim();
    const days = parseInt(document.getElementById(`days${i}`).value);

    if (!stockName) return alert(`Enter name for Stock ${i}`);

    let prices = [];
    for (let j = 1; j <= days; j++) {
      let val = parseFloat(document.getElementById(`stock${i}price${j}`).value);
      if (isNaN(val)) return alert(`Enter valid price for day ${j} in stock ${i}`);
      prices.push(val);
    }

    let changes = [];
    for (let k = 1; k < prices.length; k++) {
      changes.push(prices[k] - prices[k - 1]);
    }

    let result = findMaxProfit(changes, 0, changes.length - 1);
    results.push({ name: stockName, profit: result.profit, hold: result.sell - result.buy + 1 });
  }

  results.sort((a, b) => b.profit - a.profit);
  let best = results[0];

  let outputHTML = `<h3>💼 Multi-Stock Analysis Results</h3>`;
  results.forEach(r => {
    outputHTML += `
      <p><b>${r.name}</b> → Profit: ₹${r.profit.toFixed(2)}, Holding Period: ${r.hold} days</p>
    `;
  });

  outputHTML += `<h4 style="color:#00e6ff;">🏆 Best Performing Stock: ${best.name} (₹${best.profit.toFixed(2)})</h4>`;
  document.getElementById("output").innerHTML = outputHTML;
});

// ---------- Mode Switch ----------
document.querySelectorAll("input[name='mode']").forEach(radio => {
  radio.addEventListener("change", e => {
    if (e.target.value === "daily") {
      document.getElementById("daily-section").style.display = "block";
      document.getElementById("multi-section").style.display = "none";
    } else {
      document.getElementById("daily-section").style.display = "none";
      document.getElementById("multi-section").style.display = "block";
    }
    document.getElementById("output").innerHTML = "";
  });
});
