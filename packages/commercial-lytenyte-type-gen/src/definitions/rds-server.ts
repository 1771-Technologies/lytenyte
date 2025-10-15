import type { FunctionType, InterfaceType, PropertyType } from "../+types";
import { ColumnProp, GridProp } from "./shared-properties.js";

export const DataRequestModel: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  export: true,
  name: "DataRequestModel<T>",
  tsDoc: `
  The data request model represents the current LyteNyte Grid state at the time of creation. 
  It concatenates the grid's internal models into a single structure used to request external data. 
  Depending on your server's capabilities, you can choose to omit certain parts of the model. 
  
  The model is a snapshot only; it is not reactive and does not stay in sync with the grid's ongoing state.
  
  @group Row Data Source
  `,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`sorts\` property is an array of column sort configurations. 
        The grid can apply multiple sorts at once, which the server should respect when ordering rows. 
        Use the sort model on the server to ensure rows appear in the order the user expects. In SQL, 
        sorts typically translate to an \`ORDER BY <column> ASC|DESC\` clause. In NoSQL systems, 
        apply the equivalent ordering logic.
      `,
      name: "sorts",
      value: "SortModelItem<T>[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`filters\` property records the column filters applied to the grid. It stores key/value pairs 
        where the key is a column ID and the value is the filter definition. LyteNyte Grid 
        allows keys that do not match a column in the current state, enabling dynamic 
        filters defined on the server but not present on the client.

        Filter values can represent any type, including text, number, or date filters. 
        The server is responsible for applying these filters and returning the results. 
        In SQL, filters typically translate into \`WHERE\` clauses.
      `,
      name: "filters",
      value: "Record<string, FilterModelItem<T>>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        The \`filtersIn\` property stores set filters applied to the grid. It uses key/value pairs where 
        the key is a column ID and the value is a set filter that includes or excludes specific values. 
        LyteNyte Grid allows keys that do not match a column in the current state, 
        enabling dynamic filters defined on the server but not present on the client.

        Values in a set filter are unique by definition and cannot repeat. The server 
        applies these filters and returns the results. In SQL, set filters typically 
        translate into \`WHERE <column> IN (<set>)\` clauses.
      `,
      optional: false,
      name: "filtersIn",
      value: "Record<string, FilterIn>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`quickSearch\` property stores a text filter matched against cell values in 
        each column. The server decides which columns to search and how to 
        apply the text match. In SQL, quick search filters typically 
        translate into multiple \`WHERE <column> LIKE '%<value>%'\` clauses.
      `,
      name: "quickSearch",
      value: "string | null",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`groups\` property stores the row grouping model currently applied to the grid. 
        Each item in the model represents a grouping level, which can be defined by a 
        column or by a dynamic expression. Row groups typically translate into \`GROUP BY\` clauses in SQL.

        When a data request is made, the full group model is included, but the request targets
        only a specific slice of grouped data, identified by the \`path\` value. Including the entire
        model supports optimistic data loading and provides full context for the grouped view.
      `,
      name: "groups",
      value: "RowGroupModelItem<T>[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`groupExpansions\` property stores the expansion state of group rows as key/value pairs. 
        The key is a row ID, and the value is either a boolean or \`undefined\`. 
        A value of \`undefined\` means the row has not been explicitly expanded or collapsed, 
        so the default expansion state determines whether it is open or closed.

        \`groupExpansions\` is used only for optimistic data loading, 
        since LyteNyte Grid requests data for individual group slices.
      `,
      name: "groupExpansions",
      value: "Record<string, boolean | undefined>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`aggregations\` property defines how column values are aggregated when row groups are present.
        Aggregations are applied per column, but the output does not need to match the grid's columns exactly.
        Some columns may omit aggregation if none applies, while others 
        may include additional aggregations to attach extra data to a row.

        Each aggregation typically produces a column in the server response and
        translates to an SQL clause such as \`SUM(<column>) AS <alias>\`.
      `,
      name: "aggregations",
      value: "Record<string, { fn: AggModelFn<T> }>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`pivotGroupExpansions\` property stores the expansion state of pivot group rows as key/value pairs. 
        The key is a row ID, and the value is either a boolean or \`undefined\`. A value of \`undefined\` means the row has 
        not been explicitly expanded or collapsed, so the default expansion state decides whether it is open or closed.
      `,
      name: "pivotGroupExpansions",
      value: "Record<string, boolean | undefined>",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`pivotMode\` property is a boolean that indicates whether the pivot view in 
        LyteNyte Grid is active. Check this value before returning pivot data, since 
        pivot columns are not displayed unless the mode is enabled.
      `,
      name: "pivotMode",
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`pivotModel\` defines the current pivot configuration of the grid. 
        It specifies which columns act as pivots, the measures applied to those 
        pivots, the row groups to include, the sort state of pivot columns, and any filters in effect.

        The server uses this model to determine which pivoted data to return.
      `,
      name: "pivotModel",
      value: "ColumnPivotModel<T>",
    },
  ],
};

export const DataRequest: InterfaceType = {
  kind: "interface",
  name: "DataRequest",
  doc: { en: `` },
  export: true,
  tsDoc: `
    The \`DataRequest\` type represents a request for a slice of data from the server. 
    A slice can target either the root of the view or a specific grouping, 
    identified by the \`path\` property.

    Each request includes a unique ID, which can be used to deduplicate 
    requests or enable caching. It also defines \`start\` and \`end\` values that specify 
    the offsets of the requested slice.

    LyteNyte Grid may issue multiple \`DataRequest\` objects at once, depending on 
    the user's current view. Each request is a snapshot of the 
    grid state at the time it was made.
  
    @group Row Data Source
  `,
  properties: [
    {
      kind: "property",
      name: "id",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`id\` property uniquely identifies a data request. LyteNyte Grid 
        generates this value from the request path and the slice's \`start\` and \`end\` values. 
        The ID can be used to deduplicate requests or cache results.
      `,
      value: "string",
    },
    {
      kind: "property",
      name: "path",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`path\` property identifies the position in the data tree for a request. 
        LyteNyte Grid stores requested slices in a tree structure: the tree is flat 
        when no row grouping is applied, and nested when groups are present. 
        The \`path\` specifies which branch of the tree the request targets.

        Developers typically only need to fetch data for the given \`path\` value. In practice, 
        the path usually translates into a filter. For example, if rows are grouped 
        by the \`Category\` column and the path is \`["critical"]\`, the server may apply 
        a filter such as \`WHERE Category = 'critical'\`.
      `,
      value: "(string | null)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`start\` value specifies the offset from the first row 
        of the current data slice, relative to the node identified by 
        the \`path\`. LyteNyte Grid stores slices in a tree structure: flat when 
        no row grouping is applied, and nested when groups are present. 
        Unlike a global row index, \`start\` is always relative to its parent node.

        In SQL, \`start\` typically maps to an \`OFFSET\` value. For example, 
        if the block size is \`100\`, the request might translate to \`LIMIT 100 OFFSET <start>\`.
      `,
      name: "start",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`end\` value specifies the offset of the last row in the current data slice. 
        It is calculated as \`start + blockSize\`, but constrained by the node size (row count) 
        to avoid exceeding available rows. In practice, \`end\` is often not required for SQL-based 
        implementations of server data loading, but it is included for completeness and for non-SQL backends.

        Like other slice values, \`end\` is relative to the node identified by the \`path\` in LyteNyte Grid's tree 
        structure. The tree is flat when no row grouping is applied and nested when groups are present.
      `,
      name: "end",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`rowStartIndex\` is the projected index of the first row in the requested data. 
        It is an estimate of where LyteNyte expects the row to appear once the request resolves, 
        not the actual row index. For example, if row groups are applied and the 
        parent node is rendered at row index \`20\`, then \`rowStartIndex\` will be \`20 + start\`.

        Use \`rowStartIndex\` only in advanced server view implementations. 
        Because projected indices can change before a request resolves, relying on 
        this value increases complexity and should be avoided in most cases.
      `,
      name: "rowStartIndex",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`rowEndIndex\` is the projected index of the last row in the requested data slice. 
        Like \`rowStartIndex\`, it is an estimate based on where LyteNyte expects the rows to appear once 
        the request resolves, not an actual row index. For example, if a slice requests 100 rows and 
        the projected \`rowStartIndex\` is \`20\`, then the projected \`rowEndIndex\` will be \`120\`.

        Use \`rowEndIndex\` only in advanced server view implementations. Because projected indices 
        can change before a request resolves, relying on this value increases complexity and 
        should be avoided in most cases.
      `,
      name: "rowEndIndex",
      value: "number",
    },
  ],
};

export const DataResponseLeafItem: InterfaceType = {
  kind: "interface",
  name: "DataResponseLeafItem",
  tsDoc: `
    The \`DataResponseLeafItem\` represents the data for a leaf row node. A leaf node is the last 
    level in the data tree and cannot be expanded further. Leaf nodes appear when the view 
    is flat (no row groups) or when the expanded row is at the final grouping level.

    Each \`DataResponseLeafItem\` corresponds to a single row node, and responses can mix 
    different node types in the same request. When row groups are present, a leaf 
    item may appear before the final grouping level, which can result in unbalanced groups.

    @group Row Data Source
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        A type discriminant used by LyteNyte Grid to distinguish between leaf and 
        group data items returned by the server. When a response item has this 
        kind, the grid creates a leaf row that cannot be expanded further. 
        If no row groups are defined, all data responses should be leaf items.
      `,
      name: "kind",
      optional: false,
      value: '"leaf"',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        The unique ID that LyteNyte assigns to each row. This ID is used 
        for row selection, retrieval, updates, and as the rendering key. 
        It must be unique across all rows in all data responses.
      `,
      name: "id",
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        The data associated with the row node created from the response. 
        This value can be any type and should match your application's use case. 
        LyteNyte Grid does not validate this data; the server is treated as trusted, 
        and developers are responsible for ensuring the data is appropriate for the view.
      `,
      name: "data",
      optional: false,
      value: "any",
    },
  ],
};

export const DataResponseBranchItem: InterfaceType = {
  kind: "interface",
  name: "DataResponseBranchItem",
  tsDoc: `
    The \`DataResponseBranchItem\` represents a group node. 
    These items are converted into group row nodes and 
    indicate that additional child rows are nested beneath them.

    @group Row Data Source
  `,
  doc: { en: `` },
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        A type discriminant used by LyteNyte Grid to distinguish between leaf and 
        group items in a server response. When a response item has this kind,
        the grid creates an expandable group row.
      `,
      name: "kind",
      optional: false,
      value: '"branch"',
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        A unique ID for the row. LyteNyte Grid uses this ID to track group 
        expansion, retrieve rows, and manage selection. The ID must be 
        unique across all rows, including leaf nodes.
      `,
      name: "id",
      optional: false,
      value: "string",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        The row data for the group node. This value can be any type, 
        but LyteNyte Grid typically expects a set of key/value pairs. 
        Server responses usually contain aggregated data for the group 
        node, though not every column requires a value. The aggregation 
        model defines the expected shape of this object.
      `,
      name: "data",
      optional: false,
      value: "any",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        A group or branch node represents a branch in the row data tree used for grouped views. 
        Each node's position in the tree is determined by its \`key\`, which represents the 
        path from the root. LyteNyte Grid uses this key to place the row node in 
        the correct location within the tree.

        The \`key\` may be \`null\` if the grouping has no value. 
        In this case, \`null\` represents the absence of a value for that grouping.
      `,
      name: "key",
      optional: false,
      value: "string | null",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        A group node has child rows, though they do not need to be loaded immediately. 
        The server should indicate how many child rows a group node contains. 
        This value can be updated in later requests and serves as a hint to 
        LyteNyte Grid rather than a strict contract.

        In SQL, retrieving child counts typically translates 
        to a \`COUNT(*)\` query combined with a \`GROUP BY\` statement.
      `,
      name: "childCount",
      optional: false,
      value: "number",
    },
  ],
};

const asOfTimeProp: PropertyType = {
  kind: "property",
  doc: { en: `` },
  name: "asOfTime",
  optional: false,
  tsDoc: `
      The \`asOfTime\` property is a Unix timestamp that indicates data freshness.
      LyteNyte Grid uses it to resolve request conflicts.

      When data is loaded asynchronously, requests may arrive out of order. 
      If two requests target the same row, the one with the later \`asOfTime\` value takes precedence.
  `,
  value: "number",
};

export const DataResponsePinned: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
    Pinned rows in LyteNyte Grid remain visible regardless of user interaction 
    such as scrolling. By definition, pinned rows do not move within the view.

    The \`DataResponsePinned\` type provides data for pinned rows and allows the 
    server to set or update rows pinned to the top or bottom of the view.
  
    @group Row Data Source
  `,
  export: true,
  name: "DataResponsePinned",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "kind",
      optional: false,
      tsDoc: `
        A type discriminant used by LyteNyte Grid to indicate whether pinned rows 
        belong at the top or bottom of the view. To support both top and 
        bottom pinned rows, the server must send two separate data responses.
      `,
      value: '"top" | "bottom"',
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "data",
      optional: false,
      tsDoc: `
        The data items used by LyteNyte Grid to create pinned rows. 
        Pinned rows are always leaf rows. The response can include any number of pinned 
        rows, but it is usually best to provide only one or two.
      `,
      value: "DataResponseLeafItem[]",
    },
    asOfTimeProp,
  ],
};

export const DataResponse: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
    LyteNyte Grid's server data source sends request objects describing the 
    data needed to render the grid. The server responds with 
    one or more \`DataResponse\` objects.

    A \`DataResponse\` contains the rows and metadata required to render a slice of 
    the grid's view. Each response includes a \`path\` value, which identifies where in the row 
    tree the data belongs. Parent paths must be provided 
    before their child paths can be created.

    The server data source can handle multiple responses at once. 
    Sending multiple responses for different slices is common, especially 
    when data updates frequently.

    @group Row Data Source
  `,
  export: true,
  name: "DataResponse",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      name: "kind",
      optional: false,
      tsDoc: `
        A type discriminant used by LyteNyte Grid to identify responses for scrollable 
        rows. Pinned rows use a different structure, so for scrollable 
        rows this value must always be \`"center"\`.
      `,
      value: '"center"',
    },
    {
      kind: "property",
      doc: { en: `` },
      name: "data",
      optional: false,
      tsDoc: `
        An array of row items returned for the 
        specified \`path\`. Each item is either a \`DataResponseLeafItem\` (a leaf row with no children) 
        or a \`DataResponseBranchItem\` (a group row with nested children).

        If a response includes leaf items for a grouping that is not the final level, 
        the result is an unbalanced tree. In this case, those leaf rows cannot 
        be expanded further, regardless of the group model.
      `,
      value: "(DataResponseLeafItem | DataResponseBranchItem)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The row count for the \`path\` associated with the response. If the path is empty 
        (the root view), the size corresponds to the total root row count. LyteNyte Grid uses this 
        value to determine how much space to reserve for scrollable rows in the viewport.
      `,
      value: "number",
      name: "size",
    },
    asOfTimeProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`path\` property identifies the part of the row tree that this 
        response belongs to. It must match the path provided in the data request. 
        Because LyteNyte Grid represents the view as a flattened row tree,
        the path links data to its correct position in the hierarchy.

        For a path to be valid, its parent must already exist or be created as 
        part of the current response set. Attempting to load a deeply nested 
        path before its parents is an error.

        A path array may include \`null\` values to represent missing values in 
        a grouping. This acts as a catch-all for row groups 
        without values in every level.
      `,
      name: "path",
      value: "(string | null)[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
          The first relative index where data should begin loading. This value must match 
          the \`start\` value in the data request and is relative to the slice's 
          group, not the row index in the view. 

          Avoid using a different \`start\` value than the request. The only valid case is 
          when the response lowers the \`start\` value, typically for optimistic data loading 
          or refreshing nearby rows in the view.
      `,
      name: "start",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The last relative index where data should stop loading. This value must 
        match the \`end\` value in the data request. For optimistic data loading, 
        it may differ, but it must still be greater than the corresponding \`start\` value 
        and less than the slice \`size\`.
      `,
      name: "end",
      value: "number",
    },
  ],
};

export const DataFetcherParams: InterfaceType = {
  kind: "interface",
  name: "DataFetcherParams<T>",
  doc: { en: `` },
  export: true,
  tsDoc: `
    The LyteNyte Grid server data source requires a \`dataFetcher\` function. The \`DataFetcherParams\` type describes the 
    parameters that LyteNyte Grid passes to this function when performing data loading.

    These parameters include a set of \`DataRequest\` objects based on the current grid view 
    and the \`DataRequestModel\` at the time of the call. A \`reqTime\` value is also provided,
    which is a Unix timestamp indicating when the request was made.

    @group Row Data Source
  `,
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`requests\` property is an array of \`DataRequest\` objects. Each object defines a slice of 
        grid data to load, including its \`path\`, \`start\`, and \`end\` values, along with related metadata. 
        These requests describe exactly which part of the row tree the server should return data for.  

        LyteNyte Grid may issue multiple \`DataRequest\` objects at once, depending on the user's 
        current view. For example, if different branches of a grouped view are visible, 
        separate requests are created for each branch.  

        This property ensures that the server receives all necessary instructions to 
        provide data slices consistently, even when the grid state is complex or rapidly changing.
      `,
      name: "requests",
      value: "DataRequest[]",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`reqTime\` property is a Unix timestamp indicating when the request was initiated. 
        This value is included with every data fetch so LyteNyte Grid can resolve 
        conflicts that occur when asynchronous requests complete out of order.  

        If two requests target the same slice of data, the one with the later \`reqTime\` value takes 
        precedence. This guarantees that the grid reflects the most up-to-date 
        information, even when network latency or rapid user interactions 
        cause responses to arrive unpredictably.  

        By tracking freshness through \`reqTime\`, the grid avoids overwriting newer data 
        with stale results, providing a consistent user experience. The \`asOfTime\` property on the
        responses takes priority over the \`reqTime\` value.
      `,
      name: "reqTime",
      value: "number",
    },
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The \`model\` property contains the full \`DataRequestModel\`, which captures the grid's state at the moment the 
        request is created. This snapshot includes all relevant settings: sorting, 
        filtering, grouping, pivot configuration, and aggregation rules.  

        The server uses the \`model\` to interpret how data should be prepared before returning 
        it to the client. For example, the model tells the server which filters to 
        apply, how rows should be grouped, and what aggregations to compute.  

        Because it is a snapshot, the \`model\` does not remain in sync with the grid after 
        the request is sent. It represents the state as it existed when the request was 
        created, ensuring that the server response aligns with the user's view at that time.
      `,
      name: "model",
      value: "DataRequestModel<T>",
    },
  ],
};

export const DataFetcherFn: FunctionType = {
  kind: "function",
  name: "DataFetcherFn<T>",
  doc: { en: `` },
  tsDoc: `
    A function used by LyteNyte Grid's server row data source to fetch blocks of row
    data slices from the server. This function must be implemented by the developer,
    and LyteNyte Grid will call it whenever the view in the grid changes.

    The function receives a \`DataFetcherParams\` object that contains all the
    information required to construct a server request. This includes the set of
    \`DataRequest\` objects for the current view, a snapshot of the grid state
    (\`DataRequestModel\`), and a \`reqTime\` value marking when the request was
    initiated.

    By providing both the request details and the current grid model, LyteNyte Grid
    ensures that the server can return data consistent with the user's view. This
    allows developers to handle sorting, filtering, grouping, pivoting, and
    aggregation on the server side while keeping the grid synchronized.

    The function must return a promise that resolves to an array of \`DataResponse\`
    or \`DataResponsePinned\` objects, which describe the rows and metadata needed
    to render the grid.

    @group Row Data Source
  `,
  export: true,
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
      The parameters passed to the data fetch function.

      This object contains everything needed for the server to fulfill a grid data
      request. It includes one or more \`DataRequest\` objects (\`params.requests\`)
      that describe the slices to fetch, the full \`DataRequestModel\` (\`params.model\`)
      capturing the grid's sort, filter, group, pivot, and aggregation state, and a
      \`reqTime\` value marking when the request was initiated.

      Together, these parameters let the server return data that matches the user's
      current view while handling asynchronous requests consistently.
      `,
      name: "params",
      optional: false,
      value: "DataFetcherParams<T>",
    },
  ],
  return: "Promise<(DataResponse | DataResponsePinned)[]>",
};

export const DataColumnPivotFetcherParams: InterfaceType = {
  kind: "interface",
  name: "DataColumnPivotFetcherParams<T>",
  doc: { en: `` },
  tsDoc: `
    When column pivots are applied in LyteNyte Grid, the grid fetches pivot column
    definitions separately from the pivot row data. The \`DataColumnPivotFetcherParams\`
    type defines the parameters passed to the fetcher that retrieves these column
    pivot definitions from the server.

    @group Row Data Source
  `,
  export: true,
  properties: [
    GridProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
        The unix timestamp at the time of the request. The system uses this value to 
        resolve conflicts when multiple column pivot definitions are requested. Such 
        conflicts can occur if the pivot configuration changes while a column pivot 
        request is in flight.
      `,
      value: "number",
      name: "reqTime",
    },
    {
      kind: "property",
      tsDoc: `
        The \`model\` property contains the full \`DataRequestModel\`, which captures the grid's state at the moment the 
        request is created. This snapshot includes all relevant settings: sorting, 
        filtering, grouping, pivot configuration, and aggregation rules.  

        The server uses the \`model\` to interpret how data should be prepared before returning 
        it to the client. For example, the model tells the server which filters to 
        apply, how rows should be grouped, and what aggregations to compute.  

        Because it is a snapshot, the \`model\` does not remain in sync with the grid after 
        the request is sent. It represents the state as it existed when the request was 
        created, ensuring that the server response aligns with the user's view at that time.
      `,
      doc: { en: `` },
      name: "model",
      optional: false,
      value: "DataRequestModel<T>",
    },
  ],
};

export const DataColumnPivotFetcherFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: `
    Fetches the set of pivoted columns defined by the grid's current pivot 
    configuration. The fetcher retrieves metadata for each pivoted column 
    independently from the row data, ensuring that column definitions reflect 
    the active pivot state at the time of the request. This process allows the 
    grid to update column pivots dynamically when the configuration changes or 
    when multiple pivot definitions are requested concurrently.

    @group Row Data Source
  `,
  export: true,
  name: "DataColumnPivotFetcherFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
      The parameters passed to the column pivot fetcher. These parameters include 
      the unix timestamp of the request, which ensures consistency when resolving 
      conflicts across concurrent pivot requests, as well as any configuration 
      details required to retrieve the correct set of pivoted column definitions 
      from the server.`,
      optional: false,
      name: "params",
      value: "DataColumnPivotFetcherParams<T>",
    },
  ],
  return: "Promise<Column<T>[]>",
};

export const DataInFilterItemFetcherParams: InterfaceType = {
  kind: "interface",
  name: "DataInFilterItemFetcherParams<T>",
  doc: { en: `` },
  tsDoc: `
    The in filter (set filter) in LyteNyte Grid requests possible values from the 
    row data source attached to the grid state. For a server data source, the 
    unique values for a given column are stored on the server. 

    Developers can supply a \`DataInFilterItemFetcherFn\` to the server data 
    source to retrieve these unique filter items. The 
    \`DataInFilterItemFetcherParams\` type defines the parameters passed to the 
    fetcher function.

    @group Row Data Source
  `,
  export: true,
  properties: [
    GridProp,
    ColumnProp,
    {
      kind: "property",
      doc: { en: `` },
      optional: false,
      tsDoc: `
      The unix timestamp recorded when the in-filter fetch request is made. It 
      ensures consistency and helps resolve conflicts if multiple filter requests 
      for the same column occur at the same time.
      `,
      value: "number",
      name: "reqTime",
    },
  ],
};

export const DataInFilterItemFetcherFn: FunctionType = {
  kind: "function",
  doc: { en: `` },
  tsDoc: `
    Retrieves the unique items used in "in" filters from the server-side data 
    source. This fetch ensures that filter options reflect the actual distinct 
    values stored on the server for the specified column.
  
    @group Row Data Source
  `,
  export: true,
  name: "DataInFilterItemFetcherFn<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        The parameters passed to the in-filter fetcher function. These include details 
        such as the target column and the request timestamp, which ensure the fetcher 
        returns the correct set of unique filter items from the server.`,
      optional: false,
      name: "params",
      value: "DataInFilterItemFetcherParams<T>",
    },
  ],
  return: "Promise<FilterInFilterItem[]> | FilterInFilterItem[]",
};

export const RowDataSourceServerParams: InterfaceType = {
  kind: "interface",
  doc: { en: `` },
  tsDoc: `
    The LyteNyte Grid server row data source provides an implementation optimized 
    for fetching data in slices from the server. 

    The \`RowDataSourceServerParams\` type defines the configuration parameters 
    that can be passed to this row data source.

    @group Row Data Source
  `,
  export: true,
  name: "RowDataSourceServerParams<T>",
  properties: [
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        The \`dataFetcher\` function is required by the LyteNyte Grid server data source 
        and serves as its main entry point for retrieving rows. It fetches row slices 
        from the server based on the current grid view. LyteNyte Grid calls this function 
        whenever the view changes, which means it may be invoked frequently if the view 
        updates often.
      `,
      optional: false,
      name: "dataFetcher",
      value: "DataFetcherFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        A list of external dependencies the data source should depend on. If any of these properties
        change, then the grid will reset and fetch the data from the server again. This is the equivalent
        of adding watch keys/dependency tracking to the grid. 

        Use this property when you want the grid to reset based on some external piece of data, such as an
        external search query.

        Note all the items in the list should be referentially stable. LyteNyte Grid will shallow compare the 
        array, and check equality using the \`!==\` operator. If an item is not stable it may result in an infinite 
        reset loop.
      `,
      optional: true,
      value: "unknown[]",
      name: "dataFetchExternals",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        Column pivots produce column definitions derived from the row data. Because the 
        server data source does not have full access to row data, it relies on a 
        \`dataColumnPivotFetcher\` function. The server data source calls this function 
        to fetch pivot column definitions whenever the pivot configuration changes.
      `,
      optional: true,
      name: "dataColumnPivotFetcher",
      value: "DataColumnPivotFetcherFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        The \`inFilter\` in LyteNyte Grid filters rows by the unique values of a column. 
        LyteNyte Grid retrieves these values from the row data source. For server data 
        sources, the \`dataInFilterItemFetcher\` function retrieves the filter items on 
        demand. These items are then included with data requests to apply the filter.
        `,
      optional: true,
      name: "dataInFilterItemFetcher",
      value: "DataInFilterItemFetcherFn<T>",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
          LyteNyte Grid supports cell editing, but the row data source must perform the 
          actual update once an edit completes. For a server data source, the data is not 
          stored on the client, so LyteNyte Grid calls the \`cellUpdateHandler\` function 
          to trigger the server update. 

          Developers are responsible for executing the update and handling errors. The 
          \`cellUpdateHandler\` provides the hook for managing these updates.
      `,
      optional: true,
      name: "cellUpdateHandler",
      value: "(updates: Map<string, any>) => void",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        If true, applies cell edits to the UI before the server confirms the update. 
        This is an optimistic update, assuming the server operation will succeed. 
        Developers are responsible for reconciling server-side changes and handling 
        any failures that occur.
      `,
      optional: true,
      name: "cellUpdateOptimistically",
      value: "boolean",
    },
    {
      kind: "property",
      doc: { en: `` },
      tsDoc: `
        LyteNyte Grid's server data source fetches row data in slices. The \`blockSize\` 
        property controls the size of each slice. A larger \`blockSize\` reduces the 
        number of requests but increases the amount of data transferred per request.
      `,
      optional: true,
      name: "blockSize",
      value: "number",
    },
  ],
};
