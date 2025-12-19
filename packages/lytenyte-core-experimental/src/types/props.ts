import type { ReactNode, Ref } from "react";
import type { API } from "./api";
import type { ColumnAbstract, ColumnExtension } from "./column";
import type { Renderers, RowParams } from "./rendering";
import type { RowNode } from "./row-node";
import type { RowSource } from "./row-source";

export type RowHeight = number | `fill:${number}` | ((i: number) => number);
export type RowPin = "top" | "bottom" | null;

export interface Props<
  Data = unknown,
  Source extends RowSource = RowSource,
  Ext extends Record<string, any> = object,
  C extends ColumnAbstract = ColumnAbstract,
> {
  readonly columns?: (C &
    ColumnExtension<
      RowNode<Data>,
      C,
      API<RowNode<Data>, Source & Ext & { props: () => Props<Data, Source, Ext, C> }>,
      ReactNode
    >)[];
  readonly columnBase?: Omit<
    C &
      ColumnExtension<
        RowNode<Data>,
        C,
        API<RowNode<Data>, Source & Ext & { props: () => Props<Data, Source, Ext, C> }>,
        ReactNode
      >,
    "pin" | "field"
  >;
  readonly columnMarker?: Omit<
    ColumnExtension<
      RowNode<Data>,
      C,
      API<RowNode<Data>, Source & Ext & { props: () => Props<Data, Source, Ext, C> }>,
      ReactNode
    >,
    "field"
  > & { width: number };

  readonly columnMarkerEnabled?: boolean;
  readonly columnGroupDefaultExpansion?: boolean;
  readonly columnGroupJoinDelimiter?: string;

  readonly sizeToFit?: boolean;
  readonly gridId?: string;

  readonly rtl?: boolean;

  readonly headerHeight?: number;
  readonly headerGroupHeight?: number;
  readonly floatingRowHeight?: number;
  readonly floatingRowEnabled?: boolean;

  readonly rowOverscanTop?: number;
  readonly rowOverscanBottom?: number;
  readonly colOverscanStart?: number;
  readonly colOverscanEnd?: number;

  readonly rowScanDistance?: number;
  readonly rowSource?: Source;
  readonly rowHeight?: RowHeight;

  readonly rowFullWidthPredicate?:
    | null
    | ((
        params: RowParams<
          RowNode<Data>,
          API<RowNode<Data>, Source & Ext & { props: () => Props<Data, Source, Ext, C> }>
        >,
      ) => boolean);
  readonly rowFullWidthRenderer?:
    | Renderers<
        RowNode<Data>,
        C,
        API<RowNode<Data>, Source & Ext & { props: () => Props<Data, Source, Ext, C> }>,
        ReactNode
      >["row"]
    | null;

  readonly virtualizeCols?: boolean;
  readonly virtualizeRows?: boolean;

  readonly rowDetailHeight?: number | "auto";
  readonly rowDetailAutoHeightGuess?: number;
  readonly rowDetailRenderer?:
    | Renderers<
        RowNode<Data>,
        C,
        API<RowNode<Data>, Source & Ext & { props: () => Props<Data, Source, Ext, C> }>,
        ReactNode
      >["row"]
    | null;

  // Values that can be changed by the grid
  readonly columnGroupExpansions?: Record<string, boolean>;
  readonly onColumnGroupExpansionChange?: (change: Record<string, boolean>) => void;
  readonly rowDetailExpansions?: Set<string>;
  readonly onRowDetailExpansionsChange?: (change: Set<string>) => void;

  readonly ref?: Ref<API<RowNode<Data>, Source & Ext & { props: () => Props<Data, Source, Ext, C> }>>;
}
