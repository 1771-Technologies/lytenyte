import type { DragActive, Droppable, DropTarget } from "./drag-store";
import { getVisibleBoundingBox } from "./get-visible-bounding-box";

export function computeActiveDrag(
  mounted: Droppable[],
  tags: string[],
  data: unknown,
  id: string,
  x: number,
  y: number,
): DragActive {
  const targets = getDropTargets(mounted, x, y, tags);

  // Sort by proximity of the x/y point to the edge of the box.
  const sortedRects = targets.sort((left, right) => {
    const { x: rxA, y: ryA, width: wA, height: hA } = left.box;
    const { x: rxB, y: ryB, width: wB, height: hB } = right.box;

    // Compute minimum distance to edges for Rect A
    const minDistanceA = Math.min(
      Math.abs(x - rxA), // Distance to left edge
      Math.abs(x - (rxA + wA)), // Distance to right edge
      Math.abs(y - ryA), // Distance to top edge
      Math.abs(y - (ryA + hA)), // Distance to bottom edge
    );

    // Compute minimum distance to edges for Rect B
    const minDistanceB = Math.min(
      Math.abs(x - rxB), // Distance to left edge
      Math.abs(x - (rxB + wB)), // Distance to right edge
      Math.abs(y - ryB), // Distance to top edge
      Math.abs(y - (ryB + hB)), // Distance to bottom edge
    );

    // Sort in ascending order of minimum distance
    return minDistanceA - minDistanceB;
  });

  return {
    data,
    id,
    tags,
    over: sortedRects,
    x,
    y,
  };
}

function getDropTargets(mounted: Droppable[], x: number, y: number, tags: string[]) {
  const overlapping = mounted.reduce<DropTarget[]>((acc, c) => {
    const bb = c.target.getBoundingClientRect();
    const overlaps = x >= bb.x && x <= bb.x + bb.width && y >= bb.y && y < bb.y + bb.height;

    if (!overlaps) return acc;

    const v = getVisibleBoundingBox(c.target);
    const visiblyOverlaps = v && x >= v.x && x < v.x + v.width && y >= v.y && y <= v.y + v.height;
    if (!visiblyOverlaps) return acc;

    acc.push({
      id: c.id,
      accepted: c.accepted,
      target: c.target,
      box: bb,
      canDrop: c.accepted.some((c) => tags.includes(c)),
      xHalf: x <= bb.x + bb.width / 2 ? "left" : "right",
      yHalf: y <= bb.y + bb.height / 2 ? "top" : "bottom",
    });

    return acc;
  }, []);

  return overlapping;
}
