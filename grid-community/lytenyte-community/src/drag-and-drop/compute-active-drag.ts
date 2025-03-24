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
    const distanceToRootA = nodesToRoot(left.target);
    const distanceToRootB = nodesToRoot(right.target);

    return distanceToRootA - distanceToRootB;
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
      data: c.data,
    });

    return acc;
  }, []);

  return overlapping;
}

function nodesToRoot(c: HTMLElement | null) {
  let current = 0;
  while (c) {
    current++;
    c = c.parentElement;
  }

  return current;
}
