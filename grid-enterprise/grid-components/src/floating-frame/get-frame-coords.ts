import type { ApiEnterpriseReact } from "@1771technologies/grid-types";
import type { FloatingFrameReact } from "@1771technologies/grid-types/enterprise-react";

export function getFrameCoords<D>(
  api: ApiEnterpriseReact<D>,
  floatingFrame: FloatingFrameReact<D>,
) {
  const width = floatingFrame.w ?? 600;
  const height = floatingFrame.h ?? 600;

  const x = floatingFrame.x ?? getX(api, width);
  const y = floatingFrame.y ?? getY(api, height);

  return { x, y };
}

function getX<D>(api: ApiEnterpriseReact<D>, width: number) {
  const viewport = api.getState().internal.viewport.peek()!;

  const bound = viewport.getBoundingClientRect();

  return bound.left + bound.width / 2 - width / 2;
}
function getY<D>(api: ApiEnterpriseReact<D>, height: number) {
  const viewport = api.getState().internal.viewport.peek()!;

  const bound = viewport.getBoundingClientRect();

  return bound.top + bound.height / 2 - height;
}
