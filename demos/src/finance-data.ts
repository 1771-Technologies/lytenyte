export interface TradeRow {
  symbol: string;
  company: string;
  sector: string;
  date: string;
  type: "Buy" | "Sell";
  shares: number;
  costBasis: number;
  currentPrice: number;
  marketValue: number;
  pnl: number;
  pnlPct: number;
}

// [symbol, company, sector, currentPrice]
const STOCKS: [string, string, string, number][] = [
  // Technology
  ["NVDA", "Nvidia Corporation", "Technology", 875.4],
  ["AAPL", "Apple Inc.", "Technology", 213.18],
  ["MSFT", "Microsoft Corporation", "Technology", 415.32],
  ["GOOGL", "Alphabet Inc.", "Technology", 178.65],
  ["META", "Meta Platforms Inc.", "Technology", 521.84],
  ["AMD", "Advanced Micro Devices", "Technology", 162.49],
  ["INTC", "Intel Corporation", "Technology", 21.33],
  ["ORCL", "Oracle Corporation", "Technology", 167.72],
  ["ADBE", "Adobe Inc.", "Technology", 410.55],
  ["CRM", "Salesforce Inc.", "Technology", 282.3],
  ["CSCO", "Cisco Systems Inc.", "Technology", 58.44],
  ["QCOM", "Qualcomm Incorporated", "Technology", 189.27],
  ["TXN", "Texas Instruments Inc.", "Technology", 196.82],
  ["AVGO", "Broadcom Inc.", "Technology", 178.91],
  ["NOW", "ServiceNow Inc.", "Technology", 898.6],

  // Financials
  ["JPM", "JPMorgan Chase & Co.", "Financials", 198.44],
  ["BAC", "Bank of America Corp.", "Financials", 39.72],
  ["WFC", "Wells Fargo & Company", "Financials", 63.18],
  ["GS", "Goldman Sachs Group Inc.", "Financials", 512.77],
  ["MS", "Morgan Stanley", "Financials", 103.45],
  ["BLK", "BlackRock Inc.", "Financials", 941.2],
  ["AXP", "American Express Company", "Financials", 272.55],
  ["V", "Visa Inc.", "Financials", 271.43],
  ["MA", "Mastercard Incorporated", "Financials", 479.88],
  ["SCHW", "Charles Schwab Corporation", "Financials", 79.34],

  // Healthcare
  ["JNJ", "Johnson & Johnson", "Healthcare", 152.3],
  ["UNH", "UnitedHealth Group Inc.", "Healthcare", 523.11],
  ["PFE", "Pfizer Inc.", "Healthcare", 26.47],
  ["ABBV", "AbbVie Inc.", "Healthcare", 195.62],
  ["MRK", "Merck & Co. Inc.", "Healthcare", 98.74],
  ["TMO", "Thermo Fisher Scientific", "Healthcare", 512.88],
  ["ABT", "Abbott Laboratories", "Healthcare", 118.92],
  ["LLY", "Eli Lilly and Company", "Healthcare", 782.44],
  ["BMY", "Bristol-Myers Squibb Co.", "Healthcare", 47.21],
  ["AMGN", "Amgen Inc.", "Healthcare", 314.67],

  // Energy
  ["XOM", "ExxonMobil Corporation", "Energy", 114.78],
  ["CVX", "Chevron Corporation", "Energy", 152.33],
  ["COP", "ConocoPhillips", "Energy", 99.41],
  ["SLB", "SLB (Schlumberger)", "Energy", 42.18],
  ["EOG", "EOG Resources Inc.", "Energy", 128.55],
  ["MPC", "Marathon Petroleum Corp.", "Energy", 161.72],

  // Consumer Discretionary
  ["AMZN", "Amazon.com Inc.", "Consumer Disc.", 184.92],
  ["TSLA", "Tesla Inc.", "Consumer Disc.", 248.5],
  ["HD", "Home Depot Inc.", "Consumer Disc.", 391.44],
  ["MCD", "McDonald's Corporation", "Consumer Disc.", 291.87],
  ["NKE", "Nike Inc.", "Consumer Disc.", 74.35],
  ["SBUX", "Starbucks Corporation", "Consumer Disc.", 82.61],

  // Consumer Staples
  ["PG", "Procter & Gamble Co.", "Consumer Staples", 166.22],
  ["KO", "Coca-Cola Company", "Consumer Staples", 63.41],
  ["PEP", "PepsiCo Inc.", "Consumer Staples", 158.77],
  ["WMT", "Walmart Inc.", "Consumer Staples", 78.92],
  ["COST", "Costco Wholesale Corp.", "Consumer Staples", 896.35],

  // Industrials
  ["CAT", "Caterpillar Inc.", "Industrials", 361.28],
  ["GE", "GE Aerospace", "Industrials", 174.51],
  ["HON", "Honeywell International", "Industrials", 198.76],
  ["LMT", "Lockheed Martin Corp.", "Industrials", 458.22],
  ["RTX", "RTX Corporation", "Industrials", 126.44],
  ["UPS", "United Parcel Service", "Industrials", 121.83],

  // Utilities
  ["NEE", "NextEra Energy Inc.", "Utilities", 72.44],
  ["DUK", "Duke Energy Corporation", "Utilities", 108.91],
  ["SO", "Southern Company", "Utilities", 88.32],

  // Real Estate
  ["AMT", "American Tower Corp.", "Real Estate", 192.48],
  ["PLD", "Prologis Inc.", "Real Estate", 103.77],
  ["EQIX", "Equinix Inc.", "Real Estate", 808.55],
];

const TRADE_DATES = [
  "2021-11-15",
  "2022-01-10",
  "2022-03-14",
  "2022-06-22",
  "2022-08-08",
  "2022-10-19",
  "2023-01-04",
  "2023-03-27",
  "2023-06-12",
  "2023-08-31",
  "2023-11-07",
  "2024-01-22",
  "2024-03-11",
  "2024-05-06",
  "2024-07-15",
  "2024-09-03",
  "2024-10-28",
  "2024-12-02",
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildTradeData(): TradeRow[] {
  const rng = mulberry32(0xc0ffee42);
  const rows: TradeRow[] = [];

  for (const [symbol, company, sector, currentPrice] of STOCKS) {
    const lotCount = 3 + Math.floor(rng() * 3); // 3-5 lots per symbol
    const usedDates = new Set<string>();

    for (let i = 0; i < lotCount; i++) {
      let date: string;
      do {
        date = TRADE_DATES[Math.floor(rng() * TRADE_DATES.length)];
      } while (usedDates.has(date));
      usedDates.add(date);

      const shares = Math.round(10 + rng() * 490);
      const basisOffset = (rng() - 0.42) * currentPrice * 0.4;
      const costBasis = Math.max(1, currentPrice + basisOffset);
      const marketValue = shares * currentPrice;
      const pnl = (currentPrice - costBasis) * shares;
      const pnlPct = (currentPrice - costBasis) / costBasis;

      rows.push({
        symbol,
        company,
        sector,
        date,
        type: rng() > 0.12 ? "Buy" : "Sell",
        shares,
        costBasis: Math.round(costBasis * 100) / 100,
        currentPrice,
        marketValue: Math.round(marketValue * 100) / 100,
        pnl: Math.round(pnl * 100) / 100,
        pnlPct: Math.round(pnlPct * 10000) / 10000,
      });
    }
  }

  return rows;
}

export const SECTOR_COLORS: Record<string, string> = {
  Technology: "hsl(221 83% 53%)",
  Financials: "hsl(262 83% 58%)",
  Healthcare: "hsl(142 61% 42%)",
  "Consumer Disc.": "hsl(25 95% 53%)",
  "Consumer Staples": "hsl(38 92% 50%)",
  Industrials: "hsl(199 89% 48%)",
  Utilities: "hsl(291 64% 42%)",
  "Real Estate": "hsl(348 83% 47%)",
  Energy: "hsl(47 96% 48%)",
};

export const tradeData: TradeRow[] = buildTradeData();

export const symbolCount = STOCKS.length;
export const lotCount = tradeData.length;
