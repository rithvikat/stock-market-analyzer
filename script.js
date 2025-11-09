<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Stock Market Analyzer</title>
  <link rel="stylesheet" href="style.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>💹 Stock Market Analyzer</h1>

  <div class="mode-buttons">
    <button onclick="switchMode('single')">Single Stock</button>
    <button onclick="switchMode('multi')">Multiple Stocks</button>
  </div>

  <!-- Single Stock Mode -->
  <div class="container" id="singleMode">
    <h2>Single Stock Mode</h2>
    <label>Stock Name:</label>
    <input type="text" id="singleName" placeholder="e.g., Reliance" />
    <label>Enter Daily Prices (comma separated):</label>
    <input type="text" id="singlePrices" placeholder="e.g., 100,180,260,310,40,535,695" />
    <button onclick="analyzeSingle()">Analyze</button>
    <div id="resultSingle" class="result"></div>
  </div>

  <!-- Multiple Stocks Mode -->
  <div class="container hidden" id="multiMode">
    <h2>Multiple Stocks Mode</h2>
    <label>Enter Stocks and Prices (one per line):</label>
    <textarea id="multiStocks" rows="5" placeholder="TCS: 200,180,260,310,40,535
Infosys: 150,200,250,300,350,100
HDFC: 400,380,410,600,500,700"></textarea>
    <button onclick="analyzeMultiple()">Analyze</button>
    <div id="resultMulti" class="result"></div>
  </div>

  <canvas id="stockChart" width="600" height="300"></canvas>

  <script src="script.js"></script>
</body>
</html>

