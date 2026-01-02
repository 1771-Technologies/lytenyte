import { useEffect } from "react";
import { useRoot } from "../../root/root-context.js";
import { getScrollStatus } from "@1771technologies/lytenyte-shared";

export interface ViewportShadowsProps {
  readonly start?: boolean;
  readonly end?: boolean;
  readonly top?: boolean;
  readonly bottom?: boolean;
}

export function ViewportShadows({
  start = true,
  end = true,
  top = true,
  bottom = true,
}: ViewportShadowsProps) {
  const {
    rtl,
    view,
    viewport,
    totalHeaderHeight,
    source,
    xPositions,
    yPositions,
    dimensions,
    startOffset: startWidth,
    endOffset: endWidth,
    bottomOffset: botHeight,
  } = useRoot();

  const rowTopCount = source.useTopCount();
  const rowBotCount = source.useBottomCount();
  const rowCount = source.useRowCount();

  const heightExcludingBot = yPositions[rowCount - rowBotCount] + totalHeaderHeight;
  const widthExcludingEnd = xPositions[view.startCount + view.centerCount];

  const hasYSplit = heightExcludingBot < dimensions.innerHeight;
  const hasXSplit = xPositions.at(-1)! < dimensions.innerWidth;

  const topOffset = rowTopCount > 0 ? totalHeaderHeight + yPositions[rowTopCount] : totalHeaderHeight;

  useEffect(() => {
    if (!viewport) return;

    const [xStatus, yStatus] = getScrollStatus(viewport);
    viewport.setAttribute("data-ln-x-status", xStatus);
    viewport.setAttribute("data-ln-y-status", yStatus);

    const controller = new AbortController();

    let frame: number | null = null;
    viewport.addEventListener("scroll", () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        const [xStatus, yStatus] = getScrollStatus(viewport);
        viewport.setAttribute("data-ln-x-status", xStatus);
        viewport.setAttribute("data-ln-y-status", yStatus);
        frame = null;
      });
    });

    return () => controller.abort();
  }, [viewport]);

  return (
    <div
      data-ln-viewport-sticky
      data-ln-viewport-rtl={rtl ? true : undefined}
      style={{
        position: "sticky",
        insetInlineStart: 0,
        top: 0,
        height: 0,
        width: 0,
        zIndex: 11,
      }}
    >
      {top && (
        <div
          data-ln-top-shadow
          style={{
            width: hasXSplit ? widthExcludingEnd : dimensions.innerWidth,
            position: "absolute",
            top: topOffset,
            insetInlineStart: 0,
          }}
        />
      )}
      {top && hasXSplit && (
        <div
          data-ln-top-shadow
          style={{
            width: xPositions.at(-1)! - widthExcludingEnd,
            position: "absolute",
            top: topOffset,
            insetInlineStart: dimensions.innerWidth - (xPositions.at(-1)! - widthExcludingEnd),
          }}
        />
      )}

      {bottom && rowBotCount > 0 && (
        <div
          data-ln-bottom-shadow
          style={{
            width: hasXSplit ? widthExcludingEnd : dimensions.innerWidth,
            position: "absolute",
            top: dimensions.innerHeight - botHeight,
            insetInlineStart: 0,
          }}
        />
      )}
      {bottom && hasXSplit && rowBotCount > 0 && (
        <div
          data-ln-bottom-shadow
          style={{
            width: xPositions.at(-1)! - widthExcludingEnd,
            position: "absolute",
            top: dimensions.innerHeight - botHeight,
            insetInlineStart: dimensions.innerWidth - (xPositions.at(-1)! - widthExcludingEnd),
          }}
        />
      )}

      {start && view.startCount > 0 && (
        <div
          data-ln-start-shadow
          style={{
            height: hasYSplit ? heightExcludingBot : dimensions.innerHeight,
            position: "absolute",
            top: 0,
            insetInlineStart: startWidth,
          }}
        />
      )}
      {start && view.startCount > 0 && hasYSplit && (
        <div
          data-ln-start-shadow
          style={{
            height: botHeight,
            position: "absolute",
            top: dimensions.innerHeight - botHeight,
            insetInlineStart: startWidth,
          }}
        />
      )}
      {end && !hasXSplit && view.endCount > 0 && (
        <div
          data-ln-end-shadow
          style={{
            height: hasYSplit ? heightExcludingBot : dimensions.innerHeight,
            position: "absolute",
            top: 0,
            insetInlineStart: `calc(${dimensions.innerWidth - endWidth}px)`,
          }}
        />
      )}
      {end && !hasXSplit && view.endCount > 0 && hasYSplit && (
        <div
          data-ln-end-shadow
          style={{
            height: botHeight,
            position: "absolute",
            top: dimensions.innerHeight - botHeight,
            insetInlineStart: `calc(${dimensions.innerWidth - endWidth}px)`,
          }}
        />
      )}
    </div>
  );
}
