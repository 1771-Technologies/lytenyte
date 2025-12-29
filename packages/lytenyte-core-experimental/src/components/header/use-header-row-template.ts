import { useMemo } from "react";

export function useHeaderRowTemplate(
  rows: number,
  headerGroupHeight: number,
  headerHeight: number,
  floatingRowHeight: number,
  floatingRowEnabled: boolean,
) {
  const gridRowTemplate = useMemo(() => {
    const template = [];
    const adjust = floatingRowEnabled ? 2 : 1;

    for (let i = 0; i < rows - adjust; i++) template.push(`${headerGroupHeight}px`);

    template.push(`${headerHeight}px`);
    if (floatingRowEnabled) template.push(`${floatingRowHeight}px`);

    return template.join(" ");
  }, [floatingRowEnabled, floatingRowHeight, headerGroupHeight, headerHeight, rows]);

  return gridRowTemplate;
}
