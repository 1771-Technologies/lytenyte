import type { ClientDataSourceInitial } from "@1771technologies/grid-client-data-source-enterprise";
import { createClientDataSource } from "@1771technologies/grid-client-data-source-enterprise";
import type { ReactNode } from "react";
import { useState } from "react";

export function useClientDataSource<D>(init: ClientDataSourceInitial<D>) {
  return useState(() => createClientDataSource<D, ReactNode>(init))[0];
}
