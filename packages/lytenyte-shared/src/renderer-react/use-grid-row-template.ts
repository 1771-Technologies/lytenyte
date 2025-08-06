import { useMemo } from "react";

export function useGridRowTemplate(
  rows: number,
  headerGroupHeight: number,
  headerHeight: number,
  floatingRowHeight: number,
  floatingRowEnabled: boolean,
) {
  const gridRowTemplate = useMemo(() => {
    const template = [];
    for (let i = 0; i < rows - 1; i++) template.push(`${headerGroupHeight}px`);
    template.push(`${headerHeight}px`);
    if (floatingRowEnabled) template.push(`${floatingRowHeight}px`);

    return template.join(" ");
  }, [floatingRowEnabled, floatingRowHeight, headerGroupHeight, headerHeight, rows]);

  return gridRowTemplate;
}
