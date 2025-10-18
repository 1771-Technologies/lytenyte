export type BeforeKeyFn = () => void;
export type AfterKeyFn = () => void;
export type ScrollIntoViewFn = (p: { row?: number; column?: number; behavior: "instant" }) => void;
