import { clsx, type ClassValue } from "clsx";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

const KIND_CONFIG: Record<string, { icon: string; bg: string; text: string }> = {
  function: { icon: "ph--function", bg: "bg-ln-primary-10", text: "text-ln-primary-50" },
  string: { icon: "ph--quotes", bg: "bg-ln-green-10", text: "text-ln-green-50" },
  number: { icon: "ph--hash", bg: "bg-ln-info-10", text: "text-ln-info-50" },
  boolean: { icon: "ph--toggle-left", bg: "bg-ln-yellow-10", text: "text-ln-yellow-50" },
  object: { icon: "ph--cube", bg: "bg-ln-bg-strong", text: "text-ln-text" },
  array: { icon: "ph--brackets-square", bg: "bg-ln-yellow-10", text: "text-ln-yellow-50" },
};

export function KindBadge({ kind }: { kind: string }) {
  const cfg = KIND_CONFIG[kind] ?? {
    icon: "ph--question",
    bg: "bg-ln-bg-strong",
    text: "text-ln-text-light",
  };
  return (
    <span className={`flex size-5 shrink-0 items-center justify-center rounded ${cfg.bg} ${cfg.text}`}>
      <span className={`iconify ${cfg.icon} size-3.5`} />
    </span>
  );
}

const TYPE_COLORS: Record<string, string> = {
  string: "bg-ln-green-10 text-ln-green-70",
  number: "bg-ln-info-10 text-ln-info-70",
  boolean: "bg-ln-yellow-10 text-ln-yellow-70",
  fn: "bg-ln-primary-10 text-ln-primary-70",
  object: "bg-ln-bg-strong text-ln-text",
};

function typeTag(val: unknown): string {
  if (typeof val === "function") return "fn";
  if (Array.isArray(val)) return "array";
  if (val === null) return "null";
  return typeof val;
}

function ContextRow({ name, value, depth = 0 }: { name: string; value: unknown; depth?: number }) {
  const type = typeTag(value);
  const isObj = type === "object";
  const colorClass = TYPE_COLORS[type] ?? "bg-ln-bg-strong text-ln-text";

  let displayVal: string | null = null;
  if (type === "fn") displayVal = "() => …";
  else if (!isObj) displayVal = typeof value === "string" ? `"${value}"` : String(value);

  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center gap-3 py-2 pr-3"
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        {depth > 0 && <span className="text-ln-border-strong shrink-0 select-none font-mono text-xs">↳</span>}
        <span className="text-ln-text-dark shrink-0 font-mono text-xs font-semibold">{name}</span>
        {displayVal !== null && (
          <span className="text-ln-text-light min-w-0 truncate font-mono text-xs">{displayVal}</span>
        )}
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium ${colorClass}`}>
        {type}
      </span>
    </div>
  );
}

export function ContextRows({ obj, depth = 0 }: { obj: Record<string, unknown>; depth?: number }) {
  return (
    <>
      {Object.entries(obj).map(([key, val]) => {
        const isObj = typeTag(val) === "object" && val !== null;
        return (
          <Fragment key={key}>
            <ContextRow name={key} value={val} depth={depth} />
            {isObj && <ContextRows obj={val as Record<string, unknown>} depth={depth + 1} />}
          </Fragment>
        );
      })}
    </>
  );
}

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
