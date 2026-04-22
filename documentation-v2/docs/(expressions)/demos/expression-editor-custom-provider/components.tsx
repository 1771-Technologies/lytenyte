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
