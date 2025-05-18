export interface DataEntry {
  readonly symbol: string;
  readonly volume: number;
  readonly bid: number;
  readonly ask: number;
  readonly spread: number;

  readonly volatility: number;
  readonly latency: number;
  readonly pnl: number;
  readonly time: Date;
}

function generateNextDeviation(
  x: number,
  delta: number = 5,
  positiveBias = 0.5
) {
  const maxDiff = x * (delta / 100);
  const positiveChange = Math.random() < positiveBias;

  const change = Math.random() * maxDiff;
  return x + (positiveChange ? 1 : -1) * change;
}

function generateRandomInt(x: number, y: number) {
  return Math.floor(Math.random() * (y - x + 1)) + x;
}
function generateRandomFloat(x: number, y: number): number {
  return Math.random() * (y - x) + x; // Scale and shift Math.random() to the range [x, y]
}

const symbols = [
  "AAPL",
  "MSFT",
  "GOOG",
  "AMZN",
  "META",
  "NVDA",
  "TSLA",
  "JPM",
  "BAC",
  "WMT",
  "PG",
  "JNJ",
  "UNH",
  "HD",
  "COST",
  "PFE",
  "DIS",
  "NFLX",
  "ADBE",
  "CSCO",
  "INTC",
  "AMD",
  "QCOM",
  "PYPL",
  "CRM",
  "SBUX",
  "NKE",
  "MCD",
  "BA",
  "GS",
];
const seedData = symbols.map<DataEntry>((c) => {
  const ask = generateRandomInt(20, 1000);
  const bid = generateRandomInt(ask - 2, ask + 2);
  return {
    symbol: c,
    ask: ask,
    bid: bid,
    spread: ask - bid,
    volume: generateRandomInt(1000, 5000),
    volatility: generateRandomFloat(20, 50),

    latency: generateRandomInt(1, 1000),
    pnl: generateRandomFloat(-400, 400),
    time: new Date(Date.now() - 20_0000),
  };
});

const data = Object.fromEntries(
  seedData.map((c) => {
    const data = [c];
    for (let i = 1; i < 50; i++) {
      const current = data.at(-1)!;

      const nextAsk = generateNextDeviation(current.ask);
      const nextBid = generateRandomFloat(-1, 1) + nextAsk;
      data.push({
        ask: nextAsk,
        bid: nextBid,
        spread: nextAsk - nextBid,
        volume: generateRandomInt(1000, 5000),
        volatility: generateNextDeviation(current.volatility, 5, 0.5),
        latency: generateRandomInt(1, 1000),
        pnl: generateNextDeviation(current.pnl, 20, 0.5),
        symbol: current.symbol,
        time: new Date(Date.now() - 20_0000),
      });
    }

    return [c.symbol, data.reverse()];
  })
);

let r = Object.values(data).flat();

const nextOrderSet = () => {
  const items = symbols; // getRandomItemsFromArray(symbols, 5);

  for (let i = 0; i < items.length; i++) {
    const s = items[i];
    const rows = data[s];
    rows.pop();

    const current = rows.at(0)!;

    let nextAsk = generateNextDeviation(current.ask);

    if (Math.abs(nextAsk) > 1000) nextAsk = nextAsk / 2.3;
    if (Math.abs(nextAsk) < 3) nextAsk += Math.random() * 5;

    const nextBid = generateRandomFloat(-1, 1) + nextAsk;

    let pnl = generateNextDeviation(current.pnl, 20, 0.5);

    if (Math.abs(pnl) > 2000) pnl = pnl / (Math.random() * 20);
    if (Math.abs(pnl) < 5) {
      pnl += Math.random() * 20 + 20;
    }

    rows.unshift({
      ask: nextAsk,
      bid: nextBid,
      spread: nextAsk - nextBid,
      volume: generateRandomInt(1000, 5000),
      volatility: generateNextDeviation(current.volatility, 5, 0.5),
      latency: generateRandomInt(1, 1000),
      pnl: pnl,
      symbol: current.symbol,
      time: new Date(Date.now() - 20_0000),
    });
  }

  r = Object.values(data).flat();
};

export { r as data, nextOrderSet as nextData };
