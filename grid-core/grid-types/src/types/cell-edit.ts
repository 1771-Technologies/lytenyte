import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";
import type { RowNode } from "./row-nodes";

export type CellEditDateFormat =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export type CellEditParams = {
  maxLength?: number;
  min?: number | CellEditDateFormat;
  max?: number | CellEditDateFormat;
  step?: number;
} & { [key: string]: any };

export type CellEditLocation = {
  readonly rowIndex: number;
  readonly columnIndex: number;
};

export type CellEditBuiltInProviders = "text" | "number" | "date";
export type CellEditPointerActivator = "single-click" | "double-click" | "none";

export type CellEditPredicateParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
};

export type CellEditParserParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
  readonly value: unknown;
};
export type CellEditParser<A, D, C> = (p: CellEditParserParams<A, D, C>) => unknown;
export type CellEditUnparser<A, D, C> = (p: CellEditParserParams<A, D, C>) => unknown;

export type CellEditRowUpdaterParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
  readonly value: unknown;
};
export type CellEditRowUpdater<A, D, C> = (p: CellEditRowUpdaterParams<A, D, C>) => void;

export type CellEditProviderParams<A, D, C> = {
  readonly api: A;
  readonly row: RowNode<D>;
  readonly column: C;
  readonly value: unknown;
  readonly setValue: (v: unknown) => void;
  readonly isValid: boolean;
};

export type CellEditProvider<A, D, C, E> = (p: CellEditProviderParams<A, D, C>) => E;

export type CellEditProviders<A, D, C, E> = {
  [id: string]: CellEditProvider<A, D, C, E>;
};
export type CellEditPredicate<A, D, C> = (p: CellEditPredicateParams<A, D, C>) => boolean;

export type CellEditEventParams<A> = {
  readonly api: A;
  readonly location: CellEditLocation;
  readonly oldValue: unknown;
  readonly newValue: unknown;
  readonly error?: unknown;
};

export type CellEditBeginEventParams<A> = {
  readonly api: A;
  readonly locations: CellEditLocation[];
};
export type CellEditEndEventParams<A> = CellEditBeginEventParams<A>;
export type CellEditBeginEvent<A> = (p: CellEditBeginEventParams<A>) => void;
export type CellEditEndEvent<A> = CellEditBeginEvent<A>;
export type CellEditEvent<A> = (p: CellEditEventParams<A>) => void;

// Simplified
export type CellEditDateFormatCore = CellEditDateFormat;
export type CellEditParamsCore = CellEditParams;
export type CellEditLocationCore = CellEditLocation;
export type CellEditBuiltInProvidersCore = CellEditBuiltInProviders;
export type CellEditPointerActivatorCore = CellEditPointerActivator;
export type CellEditPredicateParamsCore<D, E> = CellEditPredicateParams<
  ApiCore<D, E>,
  D,
  ColumnCore<D, E>
>;
export type CellEditParserParamsCore<D, E> = CellEditParserParams<
  ApiCore<D, E>,
  D,
  ColumnCore<D, E>
>;
export type CellEditParserCore<D, E> = CellEditParser<ApiCore<D, E>, D, ColumnCore<D, E>>;
export type CellEditUnparserCore<D, E> = CellEditUnparser<ApiCore<D, E>, D, ColumnCore<D, E>>;
export type CellEditRowUpdaterParamsCore<D, E> = CellEditRowUpdaterParams<
  ApiCore<D, E>,
  D,
  ColumnCore<D, E>
>;
export type CellEditRowUpdaterCore<D, E> = CellEditRowUpdater<ApiCore<D, E>, D, ColumnCore<D, E>>;
export type CellEditProviderParamsCore<D, E> = CellEditProviderParams<
  ApiCore<D, E>,
  D,
  ColumnCore<D, E>
>;

export type CellEditProviderCore<D, E> = CellEditProvider<ApiCore<D, E>, D, ColumnCore<D, E>, E>;
export type CellEditProvidersCore<D, E> = CellEditProviders<ApiCore<D, E>, D, ColumnCore<D, E>, E>;
export type CellEditPredicateCore<D, E> = CellEditPredicate<ApiCore<D, E>, D, ColumnCore<D, E>>;
export type CellEditEventParamsCore<D, E> = CellEditEventParams<ApiCore<D, E>>;
export type CellEditBeginEventParamsCore<D, E> = CellEditBeginEventParams<ApiCore<D, E>>;
export type CellEditEndEventParamsCore<D, E> = CellEditEndEventParams<ApiCore<D, E>>;
export type CellEditBeginEventCore<D, E> = CellEditBeginEvent<ApiCore<D, E>>;
export type CellEditEndEventCore<D, E> = CellEditEndEvent<ApiCore<D, E>>;
export type CellEditEventCore<D, E> = CellEditEvent<ApiCore<D, E>>;

export type CellEditDateFormatPro = CellEditDateFormat;
export type CellEditParamsPro = CellEditParams;
export type CellEditLocationPro = CellEditLocation;
export type CellEditBuiltInProvidersPro = CellEditBuiltInProviders;
export type CellEditPointerActivatorPro = CellEditPointerActivator;
export type CellEditPredicateParamsPro<D, E> = CellEditPredicateParams<
  ApiPro<D, E>,
  D,
  ColumnPro<D, E>
>;
export type CellEditParserParamsPro<D, E> = CellEditParserParams<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type CellEditParserPro<D, E> = CellEditParser<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type CellEditUnparserPro<D, E> = CellEditUnparser<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type CellEditRowUpdaterParamsPro<D, E> = CellEditRowUpdaterParams<
  ApiPro<D, E>,
  D,
  ColumnPro<D, E>
>;
export type CellEditRowUpdaterPro<D, E> = CellEditRowUpdater<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type CellEditProviderParamsPro<D, E> = CellEditProviderParams<
  ApiPro<D, E>,
  D,
  ColumnPro<D, E>
>;

export type CellEditProviderPro<D, E> = CellEditProvider<ApiPro<D, E>, D, ColumnPro<D, E>, E>;
export type CellEditProvidersPro<D, E> = CellEditProviders<ApiPro<D, E>, D, ColumnPro<D, E>, E>;
export type CellEditPredicatePro<D, E> = CellEditPredicate<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type CellEditEventParamsPro<D, E> = CellEditEventParams<ApiPro<D, E>>;
export type CellEditBeginEventParamsPro<D, E> = CellEditBeginEventParams<ApiPro<D, E>>;
export type CellEditEndEventParamsPro<D, E> = CellEditEndEventParams<ApiPro<D, E>>;
export type CellEditBeginEventPro<D, E> = CellEditBeginEvent<ApiPro<D, E>>;
export type CellEditEndEventPro<D, E> = CellEditEndEvent<ApiPro<D, E>>;
export type CellEditEventPro<D, E> = CellEditEvent<ApiPro<D, E>>;
