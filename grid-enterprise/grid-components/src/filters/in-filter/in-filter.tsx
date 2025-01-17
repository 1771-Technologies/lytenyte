import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useState } from "react";
import type { FilterContainerProps } from "../filter-container/filter-container";
import { useInFilterItemLoader } from "./use-in-filter-item-loader";
import { Input } from "../../input/Input";
import { SearchIcon } from "../../icons/search-icon";
import { Button } from "../../buttons/button";
import { RefreshIcon } from "../../icons/refresh-icon";
import { t } from "@1771technologies/grid-design";
import { InFilterViewport } from "./in-filter-tree";

export interface TreeFilterProps<D> {
  readonly api: ApiEnterpriseReact<D>;
  readonly column: ColumnEnterpriseReact<D>;
  readonly itemHeight?: number;

  readonly getTreeFilterItems?: FilterContainerProps<D>["getTreeFilterItems"];

  readonly noItemsLabel: string;
  readonly errorLabel: string;

  readonly values: Set<unknown> | null;
  readonly onValuesChange: (s: Set<unknown> | null) => void;
  readonly treeViewportHeight: number;
}

export function InFilter<D>({
  column,
  api,
  itemHeight = 24,
  getTreeFilterItems,
  noItemsLabel,
  errorLabel,
  values,
  onValuesChange,
  treeViewportHeight,
}: TreeFilterProps<D>) {
  const { treeFilterItems, isLoading, hasError, retry } = useInFilterItemLoader(
    api,
    column,
    getTreeFilterItems,
  );

  const isEmpty = !isLoading && !treeFilterItems.length && !hasError;

  const [filter, setFilter] = useState("");

  return (
    <div
      className={css`
        box-sizing: border-box;
        border: 1px solid ${t.colors.borders_default};
        margin-top: ${t.spacing.space_40};
        border-radius: ${t.spacing.box_radius_medium};
        background-color: ${t.colors.backgrounds_ui_panel};

        box-shadow:
          0px 1.5px 2px 0px ${t.colors.borders_field_and_button_shadow},
          0px 0px 0px 1px ${t.colors.borders_field_and_button};
      `}
    >
      <Input
        icon={SearchIcon}
        placeholder="Search..."
        className={css`
          background-color: transparent;
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
          font-family: ${t.typography.typeface_body};
          font-size: ${t.typography.body_m};
        `}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div style={{ height: treeViewportHeight }}>
        {isLoading && (
          <div
            className={css`
              @keyframes lng1771-tree-filter-pulse {
                0%,
                100% {
                  opacity: 0.5;
                }
                50% {
                  opacity: 0.25;
                }
              }

              top: 0;
              left: 0;
              position: absolute;
              width: 100%;
              height: 100%;
              background-color: ${t.colors.backgrounds_default};
              animation: lng1771-tree-filter-pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            `}
          />
        )}
        {isEmpty && (
          <div
            className={css`
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              font-family: ${t.typography.typeface_body};
              color: ${t.colors.system_info_50};
            `}
          >
            {noItemsLabel}
          </div>
        )}
        {hasError && (
          <div
            className={css`
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <Button
              kind="secondary"
              className={css`
                color: ${t.colors.system_red_50};
                gap: ${t.spacing.space_40};
              `}
              onClick={retry}
            >
              {errorLabel}
              <RefreshIcon />
            </Button>
          </div>
        )}
        {!isEmpty && !isLoading && !hasError && (
          <InFilterViewport
            itemHeight={itemHeight}
            treeItems={treeFilterItems}
            viewportHeight={treeViewportHeight}
            values={values}
            onValuesChange={onValuesChange}
            filterValue={filter}
          />
        )}
      </div>
    </div>
  );
}
