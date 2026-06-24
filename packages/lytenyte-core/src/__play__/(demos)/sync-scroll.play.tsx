import "../test.css";
import "./sync-scroll.css";
import { useMemo, useState, type ReactNode } from "react";
import { useClientDataSource, Grid } from "../../index.js";

interface FinanceRow {
  readonly symbol: string;
  readonly company: string;
  readonly sector: string;
  readonly price: number;
  readonly change: number;
  readonly changePercent: number;
  readonly volume: number;
  readonly marketCap: number;
}

interface Spec {
  readonly data: FinanceRow;
}

const SECTOR_COLORS: Record<string, string> = {
  Technology: "#3b82f6",
  Healthcare: "#06b6d4",
  Financials: "#f59e0b",
  Energy: "#f97316",
  Consumer: "#a855f7",
  Industrials: "#6366f1",
  Materials: "#eab308",
  Utilities: "#14b8a6",
  "Real Estate": "#ec4899",
  Communication: "#8b5cf6",
};

// [symbol, company, sector] - fictional companies, so the randomized financials below never read
// as real market data.
const COMPANIES: [string, string, string][] = [
  // Technology
  ["NVTX", "Nova Tech Industries", "Technology"],
  ["PRSM", "Prism Software", "Technology"],
  ["NTRN", "Neutron Semiconductors", "Technology"],
  ["QNTM", "Quantum Bridge Corp", "Technology"],
  ["HLXA", "Helix Analytics", "Technology"],
  ["CRTX", "Cortex AI Systems", "Technology"],
  ["PHTN", "Photon Optics Inc", "Technology"],
  ["AXIM", "Axiom Cloud Networks", "Technology"],
  ["MTRX", "Matrix Computing Group", "Technology"],
  // Healthcare
  ["MERD", "Meridian Health Group", "Healthcare"],
  ["LUMN", "Luminar Biosciences", "Healthcare"],
  ["IONX", "Ionix Pharmaceuticals", "Healthcare"],
  ["VTLS", "Vitalis Diagnostics", "Healthcare"],
  ["CURA", "Cura Therapeutics", "Healthcare"],
  ["GNVA", "Genova Medical Corp", "Healthcare"],
  ["SOLC", "Solace Wellness Inc", "Healthcare"],
  ["PULS", "Pulse Biotech Labs", "Healthcare"],
  ["ARIA", "Aria Health Sciences", "Healthcare"],
  // Financials
  ["PINE", "Pinecrest Financial", "Financials"],
  ["SAGE", "Sage Capital Partners", "Financials"],
  ["TRMR", "Tremor Insurance Group", "Financials"],
  ["PLTM", "Platinum Trust Bank", "Financials"],
  ["ANCR", "Anchor Asset Management", "Financials"],
  ["BCON", "Beacon Financial Holdings", "Financials"],
  ["CRSV", "Crestview Capital", "Financials"],
  ["HRBR", "Harbor Trust Co", "Financials"],
  ["SUMM", "Summit Investment Group", "Financials"],
  // Energy
  ["SOLR", "Solera Energy", "Energy"],
  ["EMBR", "Ember Energy Partners", "Energy"],
  ["HLOS", "Helios Power Corp", "Energy"],
  ["VOLG", "Voltage Resources", "Energy"],
  ["STRT", "Strata Energy Holdings", "Energy"],
  ["APXE", "Apex Petroleum Co", "Energy"],
  ["MGNT", "Magnetar Renewables", "Energy"],
  ["FUSN", "Fusion Grid Energy", "Energy"],
  ["TERA", "Terawatt Power Inc", "Energy"],
  // Consumer
  ["VRDN", "Verdant Foods Co", "Consumer"],
  ["BLZR", "Blazer Retail Holdings", "Consumer"],
  ["CRSP", "Crisp Foods International", "Consumer"],
  ["HRVT", "Harvest Brands Group", "Consumer"],
  ["BLOM", "Bloom Consumer Goods", "Consumer"],
  ["CASC", "Cascade Retail Co", "Consumer"],
  ["ORCD", "Orchard Market Inc", "Consumer"],
  ["CSTL", "Coastal Apparel Brands", "Consumer"],
  ["SUNV", "Sunvale Foods Corp", "Consumer"],
  // Industrials
  ["AERO", "Aerolux Systems", "Industrials"],
  ["COBT", "Cobalt Robotics Inc", "Industrials"],
  ["ORBT", "Orbital Dynamics", "Industrials"],
  ["GRVT", "Gravity Logistics", "Industrials"],
  ["ASTR", "Astra Robotics", "Industrials"],
  ["TITN", "Titan Manufacturing Co", "Industrials"],
  ["FORG", "Forge Industrial Group", "Industrials"],
  ["IRNC", "Ironclad Systems Inc", "Industrials"],
  ["VCTR", "Vector Aerospace Corp", "Industrials"],
  // Materials
  ["ZNTH", "Zenith Materials Co", "Materials"],
  ["DELT", "Delta Forge Steel", "Materials"],
  ["GLDC", "Goldcrest Mining", "Materials"],
  ["GRNT", "Granite Resources Inc", "Materials"],
  ["STLG", "Sterling Materials Group", "Materials"],
  ["BDRK", "Bedrock Industries", "Materials"],
  ["ALYM", "Alloy Metals Corp", "Materials"],
  ["QRTZ", "Quartz Chemical Co", "Materials"],
  ["FNDY", "Foundry Resources Inc", "Materials"],
  // Utilities
  ["AQUA", "AquaPure Utilities", "Utilities"],
  ["VOLT", "Voltaic Power Grid", "Utilities"],
  ["CSCW", "Cascade Water Works", "Utilities"],
  ["SMTU", "Summit Utilities Co", "Utilities"],
  ["CLRW", "Clearwater Power Inc", "Utilities"],
  ["BRGT", "Bright Grid Energy", "Utilities"],
  ["NRGU", "Nor'Gate Utilities", "Utilities"],
  ["HYDR", "Hydra Water Systems", "Utilities"],
  ["TRNL", "Terminal Power Holdings", "Utilities"],
  // Real Estate
  ["CRSL", "Coral Real Estate Trust", "Real Estate"],
  ["SKYL", "Skyline Properties Inc", "Real Estate"],
  ["HRBV", "Harborview Realty Group", "Real Estate"],
  ["CRTL", "Crestline Holdings", "Real Estate"],
  ["MPLE", "Maple Grove Properties", "Real Estate"],
  ["STNE", "Stonebridge Realty Trust", "Real Estate"],
  ["PRMT", "Parkmont Holdings", "Real Estate"],
  ["VSTA", "Vista Ridge Properties", "Real Estate"],
  ["OAKF", "Oakfield Real Estate Co", "Real Estate"],
  // Communication
  ["NXUS", "Nexus Communications", "Communication"],
  ["WAVE", "Wavelength Media", "Communication"],
  ["SGNL", "Signal Broadcasting Co", "Communication"],
  ["RLAY", "Relay Networks Inc", "Communication"],
  ["ECHO", "Echo Media Group", "Communication"],
  ["BCST", "Beaconcast Communications", "Communication"],
  ["PXLN", "Pixelnet Streaming Co", "Communication"],
  ["TWRC", "Towerline Communications", "Communication"],
  ["ORBC", "Orbcom Satellite Networks", "Communication"],
];

// A tiny seeded PRNG so the "randomized" financials are stable across reloads instead of
// reshuffling every render.
function mulberry32(seed: number) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const financeData: FinanceRow[] = COMPANIES.map(([symbol, company, sector], i) => {
  const rand = mulberry32(i * 7919 + 13);

  const price = 8 + rand() * 480;
  const changePercent = (rand() - 0.5) * 8;
  const change = (price * changePercent) / 100;
  const volume = Math.floor(50_000 + rand() * 9_000_000);
  const sharesOutstanding = 10_000_000 + rand() * 2_800_000_000;
  const marketCap = price * sharesOutstanding;

  return { symbol, company, sector, price, change, changePercent, volume, marketCap };
});

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });

const NumericCell = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      height: "100%",
      width: "100%",
      paddingInline: 10,
      boxSizing: "border-box",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      fontSize: 13,
    }}
  >
    {children}
  </div>
);

const ChangeCell = ({ value, format }: { value: number; format: (v: number) => string }) => {
  const positive = value > 0;
  const negative = value < 0;
  const color = positive ? "#34d399" : negative ? "#f87171" : "#9ca3af";
  const arrow = positive ? "▲" : negative ? "▼" : "•";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 5,
        height: "100%",
        width: "100%",
        paddingInline: 10,
        boxSizing: "border-box",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 13,
        fontWeight: 600,
        color,
      }}
    >
      <span style={{ fontSize: 9 }}>{arrow}</span>
      {format(value)}
    </div>
  );
};

const columns: Grid.Column<Spec>[] = [
  {
    id: "symbol",
    name: "Symbol",
    pin: "start",
    width: 96,
    resizable: false,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as string;
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            paddingInline: 10,
          }}
        >
          <span
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.03em",
              padding: "3px 8px",
              borderRadius: 6,
              background: "rgba(59, 130, 246, 0.15)",
              color: "#60a5fa",
              border: "1px solid rgba(59, 130, 246, 0.35)",
            }}
          >
            {value}
          </span>
        </div>
      );
    },
  },
  {
    id: "company",
    name: "Company",
    width: 220,
    widthFlex: 1,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as string;
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            paddingInline: 10,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}
        >
          {value}
        </div>
      );
    },
  },
  {
    id: "sector",
    name: "Sector",
    width: 140,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as string;
      const color = SECTOR_COLORS[value] ?? "#9ca3af";
      return (
        <div style={{ display: "flex", alignItems: "center", height: "100%", paddingInline: 10 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 9px",
              borderRadius: 999,
              background: `${color}22`,
              color,
              border: `1px solid ${color}55`,
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </span>
        </div>
      );
    },
  },
  {
    id: "price",
    name: "Price",
    type: "number",
    width: 100,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as number;
      return <NumericCell>{currency.format(value)}</NumericCell>;
    },
  },
  {
    id: "change",
    name: "Change",
    type: "number",
    width: 110,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as number;
      return <ChangeCell value={value} format={(v) => `${v >= 0 ? "+" : ""}${currency.format(v)}`} />;
    },
  },
  {
    id: "changePercent",
    name: "Change %",
    type: "number",
    width: 110,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as number;
      return <ChangeCell value={value} format={(v) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`} />;
    },
  },
  {
    id: "volume",
    name: "Volume",
    type: "number",
    width: 100,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as number;
      return <NumericCell>{compact.format(value)}</NumericCell>;
    },
  },
  {
    id: "marketCap",
    name: "Mkt Cap",
    type: "number",
    width: 120,
    cellRenderer: (p) => {
      const value = p.api.columnField(p.column, p.row) as number;
      return <NumericCell>${compact.format(value)}</NumericCell>;
    },
  },
];

const RunDemoButton = ({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      marginTop: 16,
      padding: "9px 16px",
      borderRadius: 8,
      border: "1px solid #2563eb",
      background: disabled ? "#1e293b" : "#2563eb",
      color: disabled ? "#64748b" : "#ffffff",
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "system-ui, sans-serif",
      cursor: disabled ? "default" : "pointer",
    }}
  >
    {label}
  </button>
);

const GRID_ID = "sync-scroll-demo";
const SCROLL_SPEED = 36; // px/ms
const FADE_MS = 350;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Animates the grid's own viewport from its current scrollTop to `target` at a constant speed.
// Plain rAF + scrollTop, no native `scrollTo({ behavior: "smooth" })` - that API can't report
// progress, and we need to know exactly when one leg finishes before starting the next.
function scrollToVertical(el: HTMLElement, target: number, speed: number): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    const startTop = el.scrollTop;
    const distance = target - startTop;
    const duration = Math.abs(distance) / speed;

    if (duration === 0) {
      resolve();
      return;
    }

    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      el.scrollTop = startTop + distance * t;

      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };

    requestAnimationFrame(step);
  });
}

export default function SyncScrollDemo() {
  const data = useMemo(() => {
    const d = [...financeData, ...financeData, ...financeData, ...financeData];
    return [...d, ...d, ...d, ...d, ...d];
  }, []);
  const ds = useClientDataSource({ data });

  const [sync, setSync] = useState(false);
  const [demoPhase, setDemoPhase] = useState<"idle" | "scrolling-off" | "switching" | "scrolling-on">("idle");
  const [overlay, setOverlay] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const running = demoPhase !== "idle";

  const runDemo = async () => {
    if (running) return;

    const el = document.querySelector<HTMLElement>(`[data-ln-gridid="${GRID_ID}"][data-ln-viewport]`);
    if (!el) return;

    const maxTop = el.scrollHeight - el.clientHeight;

    setSync(false);
    setDemoPhase("scrolling-off");
    await scrollToVertical(el, maxTop, SCROLL_SPEED);
    await scrollToVertical(el, 0, SCROLL_SPEED);

    setDemoPhase("switching");
    setOverlay("Switching to sync scrolling in 3");
    await wait(700);
    setOverlay("Switching to sync scrolling in 2");
    await wait(700);
    setOverlay("Switching to sync scrolling in 1");
    await wait(700);

    // Fade the grid out, flip sync while it's invisible, then fade back in - reads as if the grid
    // itself were swapped out for a "synced" one rather than a prop quietly changing underneath.
    setFading(true);
    await wait(FADE_MS);
    setSync(true);
    setOverlay("Switched!");
    await wait(250);
    setFading(false);
    await wait(FADE_MS);
    setOverlay(null);

    setDemoPhase("scrolling-on");
    await scrollToVertical(el, maxTop, SCROLL_SPEED);
    await scrollToVertical(el, 0, SCROLL_SPEED);

    setDemoPhase("idle");
  };

  const demoLabel =
    demoPhase === "scrolling-off"
      ? "Running: scrolling with sync OFF…"
      : demoPhase === "switching"
        ? "Switching sync scrolling on…"
        : demoPhase === "scrolling-on"
          ? "Running: scrolling with sync ON…"
          : "Run demo (scroll sync off, then on)";

  return (
    <div
      style={{
        background: "#05070a",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <RunDemoButton onClick={runDemo} disabled={running} label={demoLabel} />
      <div
        style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          marginTop: 16,
          border: "1px solid #1f2430",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            opacity: fading ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        >
          <Grid
            gridId={GRID_ID}
            columns={columns}
            rowSource={ds}
            rowHeight={44}
            headerHeight={38}
            viewportInitialWidth={560}
            viewportInitialHeight={600}
            suppressScrollFlash={sync}
          />
        </div>
        {overlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(5, 7, 10, 0.55)",
              backdropFilter: "blur(2px)",
              pointerEvents: "none",
              zIndex: 20,
            }}
          >
            <span
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: 30,
                fontWeight: 800,
                color: "#ffffff",
                textShadow: "0 2px 14px rgba(0, 0, 0, 0.6)",
              }}
            >
              {overlay}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
