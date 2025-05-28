export interface SVVR_INIT_REQ_EVENT {
  readonly importPath: string;
  readonly id: string;
  readonly name: string;
}

export interface SVVR_INIT_RES_EVENT {
  readonly screenshots: { filename: string; base64: string; actual?: string }[];
}
