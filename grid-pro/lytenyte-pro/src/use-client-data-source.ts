import type {
  ClientDataSourceInitial,
  ClientRowDataSource,
} from "@1771technologies/grid-client-data-source-pro";
import { createClientDataSource } from "@1771technologies/grid-client-data-source-pro";
import type { ReactNode } from "react";
import { useState } from "react";

export type ClientDataSourceInitialReact<D> = ClientDataSourceInitial<D, ReactNode>;
export type ClientRowDataSourceReact<D> = ClientRowDataSource<D, ReactNode>;

export const createClientDataSourceReact = <D>(
  init: ClientDataSourceInitialReact<D>,
): ClientRowDataSourceReact<D> => {
  return createClientDataSource(init);
};

export function useClientDataSource<D>(init: ClientDataSourceInitial<D, ReactNode>) {
  return useState(() => {
    return createClientDataSource<D, ReactNode>(init);
  })[0];
}
