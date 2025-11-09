// -------- Divide and Conquer for Max Subarray Sum --------
function findCrossingProfit(arr, left, mid, right) {
  let leftSum = -Infinity, rightSum = -Infinity;
  let sum = 0;
  let buy = mid, sell = mid + 1;

  for (let i = mid; i >= left; i--) {
    sum += arr[i];
    if (sum > leftSum) {
      leftSum = sum;
      buy = i;
    }
  }

  sum = 0;
  for (let i = mid + 1; i <= right; i++) {
    sum += arr[i];
    if (sum > rightSum) {
      rightSum = sum;
      sell = i;
    }
  }

  return { profit: leftSum + rightSum, buy, sell };
}

function findMaxProfit(arr, left, right) {
  if (left === right)
    return { profit: arr[left], buy: left, sell: right };

  let mid = Math.floor((left + right) / 2);
  let leftRes = findMaxProfit(arr, left, mid);
  let rightRes = findMaxProfit(arr, mid + 1, right);
  let crossRes = findCrossingProfit(arr, left, mid, right);

  if (leftRes.profit >= rightRes.profit && leftRes.profit >= crossRes.profit)
    return leftRes;
  else if (rightRes.profit >= leftRes.profit && rightRes.profit >= crossRes.profit)
    return rightRes;
  else
    return crossRes;
}

// -------- Mode Switch Logic --------
document.querySelectorAll('input[name="mode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    document.getElementById("daily-mode").style.display = mode === "daily" ? "block" : "none";
    document.getElementById("multi-mode").style.display = mode === "multiple" ? "block" : "none";
    document.getElementById("output").innerHTML = "";
  });
});

// -------- Daily Mode --------
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
    div.innerHTML = `Day ${i} Price: ₹ <input type="number" id="price${i}">`;
    container.appendChild(div);
  }

  document.getElementById("analyze").style.display = "inline-block";
});

document.getElementById("analyze").addEventListener("click", () => {
  const stock = document.getElementById("stock").value.trim();
  const days = parseInt(document.getElementById("days").value);
  let prices = [];

  if (!stock) {
    alert("Enter stock name!");
    return;
  }

  for (let i = 1; i <= days; i++) {
    const val = parseFloat(document.getElementById(`price${i}`).value);
    if (isNaN(val)) {
      alert(`Enter valid price for Day ${i}`);
      return;
    }
    prices.push(val);
  }

  const changes = [];
  for (let i = 1; i < prices.length; i++) changes.push(prices[i] - prices[i - 1]);
  const result = findMaxProfit(changes, 0, changes.length - 1);

  const holdingPeriod = result.sell - result.buy + 1;
  document.getElementById("output").innerHTML = `
    <h3>📊 Analysis Result for ${stock}</h3>
    <p><strong>Maximum Profit:</strong> ₹${result.profit.toFixed(2)}</p>
    <p><strong>Holding Period:</strong> ${holdingPeriod} days</p>
  `;
});

// -------- Multiple Shares Mode --------
document.getElementById("generateShares").addEventListener("click", () => {
  const num = parseInt(document.getElementById("numShares").value);
  const container = document.getElementById("shares-container");
  container.innerHTML = "";

  if (num < 1) {
    alert("Enter at least 1 share!");
    return;
  }

  for (let s = 1; s <= num; s++) {
    const div = document.createElement("div");
    div.className = "share-block";
    div.innerHTML = `
      <h4>Share ${s}</h4>
      <input type="text" id="shareName${s}" placeholder="Stock Name">
      <input type="number" id="shareDays${s}" min="2" placeholder="No. of Days">
      <button onclick="generateSharePrices(${s})">Add Prices</button>
      <div id="sharePrices${s}"></div>
    `;
    container.appendChild(div);
  }

  document.getElementById("analyzeShares").style.display = "inline-block";
});

function generateSharePrices(id) {
  const days = parseInt(document.getElementById(`shareDays${id}`).value);
  const container = document.getElementById(`sharePrices${id}`);
  container.innerHTML = "";

  if (days < 2) {
    alert("At least 2 days required!");
    return;
  }

  for (let i = 1; i <= days; i++) {
    container.innerHTML += `Day ${i} Price: ₹<input type="number" id="s${id}p${i}"><br>`;
  }
}

document.getElementById("analyzeShares").addEventListener("click", () => {
  const num = parseInt(document.getElementById("numShares").value);
  let results = [];

  for (let s = 1; s <= num; s++) {
    const name = document.getElementById(`shareName${s}`).value.trim();
    const days = parseInt(document.getElementById(`shareDays${s}`).value);
    if (!name) continue;

    let prices = [];
    for (let i = 1; i <= days; i++) {
      const val = parseFloat(document.getElementById(`s${s}p${i}`).value);
      if (isNaN(val)) return alert(`Invalid price for ${name}, Day ${i}`);
      prices.push(val);
    }

    const changes = [];
    for (let i = 1; i < prices.length; i++) changes.push(prices[i] - prices[i - 1]);
    const res = findMaxProfit(changes, 0, changes.length - 1);
    const holding = res.sell - res.buy + 1;
    results.push({ name, profit: res.profit, hold: holding });
  }

  let best = results.reduce((a, b) => (a.profit > b.profit ? a : b));
  let html = "<h3>💼 Multi-Stock Analysis</h3>";
  results.forEach(r => {
    html += `<p><strong>${r.name}:</strong> Profit ₹${r.profit.toFixed(2)} | Holding ${r.hold} days</p>`;
  });
  html += `<p><strong>🏆 Best Performer:</strong> ${best.name} with ₹${best.profit.toFixed(2)}</p>`;
  document.getElementById("output").innerHTML = html;
});
