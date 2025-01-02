export interface TreeDataSourceInitial<D> {
  readonly data: D[];
  readonly topData?: D[];
  readonly bottomData?: D[];
  readonly getTreeDataPath: (data: D) => string[];
}
