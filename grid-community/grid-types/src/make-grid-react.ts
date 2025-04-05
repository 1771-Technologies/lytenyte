import type { ReactNode } from "react";
import type {
  Api as ApiCommunity,
  Init as PropsCommunity,
  MakeGridCommunity,
  Column as ColumnCommunity,
  ColumnBase as ColumnBaseCommunity,
  ColumnRowGroup as ColumnRowGroupCommunity,
} from "./make-grid-community";
import type {
  Api as ApiEnterprise,
  Init as PropsEnterprise,
  MakeGridEnterprise,
  Column as ColumnEnterprise,
  ColumnBase as ColumnBaseEnterprise,
  ColumnRowGroup as ColumnRowGroupEnterprise,
  RowDataSourceEnterprise,
} from "./make-grid-pro";
import type { StoreCommunity as RawStoreCommunity } from "./store/store-community";
import type { StoreEnterprise as RawStoreEnterprise } from "./store/store-pro";

export type MakeGridCommunityReact<D> = MakeGridCommunity<D, ReactNode>;
export type ApiCommunityReact<D> = ApiCommunity<D, ReactNode>;
export type PropsCommunityReact<D> = PropsCommunity<D, ReactNode>;
export type ColumnCommunityReact<D> = ColumnCommunity<D, ReactNode>;
export type ColumnBaseCommunityReact<D> = ColumnBaseCommunity<D, ReactNode>;
export type ColumnRowGroupCommunityReact<D> = ColumnRowGroupCommunity<D, ReactNode>;

export type MakeGridEnterpriseReact<D> = MakeGridEnterprise<D, ReactNode>;
export type ApiEnterpriseReact<D> = ApiEnterprise<D, ReactNode>;
export type PropsEnterpriseReact<D> = PropsEnterprise<D, ReactNode>;
export type ColumnEnterpriseReact<D> = ColumnEnterprise<D, ReactNode>;
export type ColumnBaseEnterpriseReact<D> = ColumnBaseEnterprise<D, ReactNode>;
export type ColumnRowGroupEnterpriseReact<D> = ColumnRowGroupEnterprise<D, ReactNode>;
export type RowDataSourceEnterpriseReact<D> = RowDataSourceEnterprise<D, ReactNode>;

export type StoreCommunityReact<D> = RawStoreCommunity<D, ReactNode>;
export type StoreEnterpriseReact<D> = RawStoreEnterprise<D, ReactNode>;
