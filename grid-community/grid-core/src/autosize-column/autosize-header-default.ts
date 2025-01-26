import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type { AutosizeHeaderParameters } from "@1771technologies/grid-types/community";
import { measureText } from "./measure-text";

export function autosizeHeaderDefault<D, E>({
  api,
  column,
}: AutosizeHeaderParameters<ApiCommunity<D, E>, ColumnCommunity<D, E>>) {
  const text = column.headerName ?? column.id;

  const state = api.getState();

  return measureText(text, state.internal.viewport.get() ?? document.body);
}

export function autosizeHeaderDefaultEnterprise<D, E>({
  api,
  column,
}: AutosizeHeaderParameters<ApiEnterprise<D, E>, ColumnEnterprise<D, E>>) {
  const sx = api.getState();

  const base = sx.columnBase.peek();
  const rowGroupModel = sx.rowGroupModel.peek();

  const aggFn = column.aggFunc ?? base.aggFunc;

  const headerText = column.headerName ?? column.id;
  const secondary = column.headerSecondaryLabel ?? "";
  const aggFuncText =
    !rowGroupModel.length || !aggFn ? "" : typeof aggFn === "string" ? `(${aggFn})` : `FN(X)`;

  const aggFuncDisplayMode =
    column.headerAggFuncDisplayMode ?? base.headerAggFuncDisplayMode ?? "inline";

  let topText: string;
  if (aggFuncDisplayMode === "inline") topText = headerText + " " + aggFuncText;
  else topText = headerText;

  let botText: string;
  if (aggFuncDisplayMode === "secondary") botText = secondary + " " + aggFuncText;
  else botText = secondary;

  const textToMeasure = topText.length < botText.length ? botText : topText;

  const width = measureText(textToMeasure, sx.internal.viewport.peek() || document.body);

  return width + 4;
}
