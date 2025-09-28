function analyzeStocks() {
    const pricesInput = document.getElementById('prices').value;
    const prices = pricesInput.split(',').map(Number);

    if (prices.length === 0) {
        alert("Please enter stock prices!");
        return;
    }

    const result = maxSubarray(prices, 0, prices.length - 1);
    document.getElementById('result').innerHTML = 
        `Maximum Profit: ₹${result.sum} <br>Buy on Day ${result.start + 1}, Sell on Day ${result.end + 1}`;
}

// Divide and Conquer Maximum Subarray Sum
function maxSubarray(arr, left, right) {
    if (left === right) {
        return {sum: 0, start: left, end: right};
    }

    const mid = Math.floor((left + right) / 2);

    const leftResult = maxSubarray(arr, left, mid);
    const rightResult = maxSubarray(arr, mid + 1, right);
    const crossResult = maxCrossingSubarray(arr, left, mid, right);

    if (leftResult.sum >= rightResult.sum && leftResult.sum >= crossResult.sum) return leftResult;
    if (rightResult.sum >= leftResult.sum && rightResult.sum >= crossResult.sum) return rightResult;
    return crossResult;
}

function maxCrossingSubarray(arr, left, mid, right) {
    let leftSum = -Infinity, sum = 0, maxLeft = mid;
    for (let i = mid; i >= left; i--) {
        sum += (i > 0 ? arr[i] - arr[i-1] : 0); // daily profit
        if (sum > leftSum) { leftSum = sum; maxLeft = i; }
    }

    let rightSum = -Infinity; sum = 0; let maxRight = mid + 1;
    for (let i = mid + 1; i <= right; i++) {
        sum += (arr[i] - arr[i-1]);
        if (sum > rightSum) { rightSum = sum; maxRight = i; }
    }

    return {sum: leftSum + rightSum, start: maxLeft, end: maxRight};
}
