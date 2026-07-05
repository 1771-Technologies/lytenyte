import "./shadcn.css";
import "@1771technologies/lytenyte-pro/grid.css";
import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/shadcn.css";

import { useMemo, useState } from "react";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import { RowGroupCell } from "@1771technologies/lytenyte-pro/components";
import { tradeData, symbolCount, lotCount, SECTOR_COLORS, type TradeRow } from "./finance-data.js";

interface Spec extends Grid.GridSpec {
  data: TradeRow;
}

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const pct = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function PnlCell({ value, isPercent }: { value: number; isPercent?: boolean }) {
  const positive = value >= 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        paddingInline: 12,
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
        fontWeight: 600,
        color: positive ? "hsl(142 61% 42%)" : "hsl(0 72% 51%)",
        gap: 3,
      }}
    >
      <span style={{ fontSize: 10 }}>{positive ? "▲" : "▼"}</span>
      {isPercent ? pct.format(Math.abs(value)) : usd.format(Math.abs(value))}
    </div>
  );
}

function NumCell({ value }: { value: number | null | undefined }) {
  if (value == null) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        paddingInline: 12,
        fontFamily: "ui-monospace, monospace",
        fontSize: 12,
      }}
    >
      {usd.format(value)}
    </div>
  );
}

function SectorBadge({ sector }: { sector: string }) {
  const color = SECTOR_COLORS[sector] ?? "hsl(220 9% 46%)";
  return (
    <div style={{ display: "flex", alignItems: "center", paddingInline: 12 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          paddingInline: 8,
          paddingBlock: 2,
          borderRadius: 9999,
          fontSize: 11,
          fontWeight: 500,
          background: `color-mix(in srgb, ${color} 15%, transparent)`,
          color,
          border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        }}
      >
        {sector}
      </span>
    </div>
  );
}

function TypeBadge({ type }: { type: "Buy" | "Sell" }) {
  const isBuy = type === "Buy";
  return (
    <div style={{ display: "flex", alignItems: "center", paddingInline: 12 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          paddingInline: 8,
          paddingBlock: 2,
          borderRadius: 4,
          fontSize: 11,
          fontWeight: 600,
          background: isBuy
            ? "color-mix(in srgb, hsl(142 61% 42%) 15%, transparent)"
            : "color-mix(in srgb, hsl(0 72% 51%) 15%, transparent)",
          color: isBuy ? "hsl(142 61% 42%)" : "hsl(0 72% 51%)",
        }}
      >
        {type}
      </span>
    </div>
  );
}

const columns: Grid.Column<Spec>[] = [
  {
    id: "company",
    name: "Company",
    width: 220,
    widthFlex: 1,
    cellRenderer: ({ row }) => {
      if (row.kind !== "leaf") return null;
      return (
        <div
          style={{
            paddingInline: 12,
            fontSize: 13,
            fontFamily: "ui-monospace monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.data.company}
        </div>
      );
    },
  },
  {
    id: "sector",
    name: "Sector",
    width: 160,
    cellRenderer: ({ row }) => {
      if (row.kind !== "leaf") return null;
      return <SectorBadge sector={row.data.sector} />;
    },
  },
  {
    id: "date",
    name: "Trade Date",
    width: 110,
    cellRenderer: ({ row }) => {
      if (row.kind !== "leaf") return null;
      return (
        <div style={{ paddingInline: 12, fontSize: 12, color: "var(--muted-foreground)" }}>
          {row.data.date}
        </div>
      );
    },
  },
  {
    id: "type",
    name: "Type",
    width: 72,
    cellRenderer: ({ row }) => {
      if (row.kind !== "leaf") return null;
      return <TypeBadge type={row.data.type} />;
    },
  },
  {
    id: "shares",
    name: "Shares",
    type: "number",
    width: 88,
    cellRenderer: ({ row }) => {
      if (row.kind === "branch") {
        return (
          <div
            style={{
              paddingInline: 12,
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              fontWeight: 600,
            }}
          >
            {compact.format(row.data.shares as number)}
          </div>
        );
      }
      if (row.kind !== "leaf") return null;
      return (
        <div
          style={{
            paddingInline: 12,
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {row.data.shares.toLocaleString()}
        </div>
      );
    },
  },
  {
    id: "costBasis",
    name: "Cost Basis",
    type: "number",
    width: 110,
    cellRenderer: ({ row }) => {
      if (row.kind !== "leaf") return null;
      return <NumCell value={row.data.costBasis} />;
    },
  },
  {
    id: "currentPrice",
    name: "Last Price",
    type: "number",
    width: 110,
    cellRenderer: ({ row }) => {
      if (row.kind !== "leaf") return null;
      return <NumCell value={row.data.currentPrice} />;
    },
  },
  {
    id: "marketValue",
    name: "Market Value",
    type: "number",
    width: 130,
    cellRenderer: ({ row }) => {
      const val =
        row.kind === "leaf"
          ? row.data.marketValue
          : row.kind === "branch"
            ? (row.data.marketValue as number)
            : null;
      return <NumCell value={val} />;
    },
  },
  {
    id: "pnl",
    name: "Unrealized P&L",
    type: "number",
    width: 140,
    cellRenderer: ({ row }) => {
      const val =
        row.kind === "leaf" ? row.data.pnl : row.kind === "branch" ? (row.data.pnl as number) : null;
      if (val == null) return null;
      return <PnlCell value={val} />;
    },
  },
  {
    id: "pnlPct",
    name: "P&L %",
    type: "number",
    width: 100,
    cellRenderer: ({ row }) => {
      if (row.kind !== "leaf") return null;
      return <PnlCell value={row.data.pnlPct} isPercent />;
    },
  },
];

export default function ShadcnPortfolioDemo() {
  const [dark, setDark] = useState(false);

  const data = useMemo(() => tradeData, []);
  const [expansions, setExpansions] = useState<Record<string, boolean | undefined>>({
    NVDA: true,
    AAPL: true,
  });

  const ds = useClientDataSource<Spec>({
    data,
    group: [{ id: "symbol" }],
    rowGroupDefaultExpansion: false,
    rowGroupExpansions: expansions,
    onRowGroupExpansionChange: setExpansions,
    aggregate: (leaves) => ({
      shares: leaves.reduce((s, r) => s + r.data.shares, 0),
      marketValue: leaves.reduce((s, r) => s + r.data.marketValue, 0),
      pnl: leaves.reduce((s, r) => s + r.data.pnl, 0),
    }),
  });

  const [rowGroupColumn, setRowGroupColumn] = useState<Grid.Props<Spec>["rowGroupColumn"]>({
    name: "Symbol",
    width: 130,
    cellRenderer: (props) => (
      <RowGroupCell
        {...props}
        groupLabel={(row) => (
          <span
            style={{
              fontWeight: 700,
              fontFamily: "ui-monospace, monospace",
              fontSize: 13,
              letterSpacing: "0.04em",
            }}
          >
            {row.key}
          </span>
        )}
      />
    ),
  });

  return (
    <div
      className={dark ? "dark" : ""}
      style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--background)" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          background: "var(--card)",
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>Portfolio Holdings</div>
          <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
            {symbolCount} symbols · {lotCount} lots
          </div>
        </div>
        <button data-ln-button="secondary" data-ln-size="sm" onClick={() => setDark((d) => !d)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div style={{ flex: 1, minHeight: 0, padding: "16px 20px" }}>
        <div
          className={`ln-grid ln-shadcn ${dark ? "ln-dark" : "ln-light"}`}
          style={{ height: "100%", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}
        >
          <Grid
            columns={columns}
            columnBase={useMemo(() => ({ resizable: true }), [])}
            rowSource={ds}
            rowGroupColumn={rowGroupColumn}
            onRowGroupColumnChange={setRowGroupColumn}
            rowAlternateAttr="root"
            rowAnimate
          />
        </div>
      </div>
    </div>
  );
}
