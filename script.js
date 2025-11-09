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

// Daily Prices
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

// Mode switch
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

