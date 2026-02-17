import type { RowNode } from "@1771technologies/lytenyte-shared";
import { useMemo, useRef } from "react";
import { usePiece } from "../../hooks/use-piece.js";

export interface UseFlattenedPieceParams<T> {
  leafsTop: RowNode<T>[];
  leafsCenter: RowNode<T>[];
  leafsBot: RowNode<T>[];

  groupFlat: RowNode<T>[] | null;

  centerIndices: number[];
}

export function useFlattenedPiece<T>({
  leafsTop,
  leafsCenter,
  leafsBot,
  groupFlat,
  centerIndices,
}: UseFlattenedPieceParams<T>) {
  const rowByIdRef = useRef<Map<string, RowNode<T>>>(null as any);
  const rowByIndexRef = useRef<Map<number, RowNode<T>>>(null as any);
  const rowIdToRowIndexRef = useRef<Map<string, number>>(null as any);

  const [flatten] = useMemo(() => {
    const flat: RowNode<T>[] = [];
    const byId = new Map<string, RowNode<T>>();
    const byIndex = new Map<number, RowNode<T>>();
    const byIdToIndex = new Map<string, number>();

    for (let i = 0; i < leafsTop.length; i++) {
      const node = leafsTop[i];
      flat.push(node);
      byIndex.set(i, node);
      byId.set(node.id, node);
      byIdToIndex.set(node.id, i);
    }

    const offset = leafsTop.length;
    if (groupFlat) {
      for (let i = 0; i < groupFlat.length; i++) {
        const rowIndex = i + offset;

        const node = groupFlat[i];
        flat.push(node);
        byIndex.set(rowIndex, node);
        byId.set(node.id, node);
        byIdToIndex.set(node.id, rowIndex);
      }
    } else {
      for (let i = 0; i < centerIndices.length; i++) {
        const rowIndex = i + offset;

        const srcIndex = centerIndices[i];
        const node = leafsCenter[srcIndex];
        flat.push(node);
        byIndex.set(rowIndex, node);
        byId.set(node.id, node);
        byIdToIndex.set(node.id, rowIndex);
      }
    }

    const botOffset = offset + (groupFlat ? groupFlat.length : centerIndices.length);
    for (let i = 0; i < leafsBot.length; i++) {
      const rowIndex = i + botOffset;
      const node = leafsBot[i];
      flat.push(node);
      byIndex.set(rowIndex, node);
      byId.set(node.id, node);
      byIdToIndex.set(node.id, rowIndex);
    }

    rowByIdRef.current = byId;
    rowByIndexRef.current = byIndex;
    rowIdToRowIndexRef.current = byIdToIndex;

    return [flat];
  }, [centerIndices, groupFlat, leafsBot, leafsCenter, leafsTop]);

  const piece = usePiece(flatten);

  return { flatten, flatten$: piece, rowByIdRef, rowByIndexRef, rowIdToRowIndexRef };
}
