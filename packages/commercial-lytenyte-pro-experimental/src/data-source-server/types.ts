export interface DataRequest {
  readonly id: string;
  readonly path: (string | null)[];
  readonly start: number;
  readonly end: number;
  readonly rowStartIndex: number;
  readonly rowEndIndex: number;
}

export interface DataResponse {
  readonly kind: "center";
  readonly data: (DataResponseLeafItem | DataResponseBranchItem)[];
  readonly size: number;
  readonly asOfTime: number;
  readonly path: (string | null)[];
  readonly start: number;
  readonly end: number;
}

export interface DataResponseBranchItem {
  readonly kind: "branch";
  readonly id: string;
  readonly data: any;
  readonly key: string | null;
  readonly childCount: number;
}

export interface DataResponseLeafItem {
  readonly kind: "leaf";
  readonly id: string;
  readonly data: any;
}

export interface DataResponsePinned {
  readonly kind: "top" | "bottom";
  readonly data: DataResponseLeafItem[];
  readonly asOfTime: number;
}

export interface QueryFnParams<K extends unknown[]> {
  readonly queryKey: K;
  readonly requests: DataRequest[];
  readonly reqTime: number;
  readonly model: {
    readonly rowGroupExpansions: Record<string, boolean | undefined>;
  };
}
