### Props Driven Grid

LyteNyte Grid is now a full `prop` driven grid. In version 1, the `useLyteNyte` hook was used to create
a grid state object, that could then be passed around. Changes to the state object results in declarative
updates to the grid.

Using a grid state object, LyteNyte Grid enabled an incredible amount of functionality with minimal effort,
however, the approach had one main drawback: **it did not completely eliminate data sync issues with React.**

LyteNyte Grid must work with your applications data directly. To do this, LyteNyte Grid could not take ownership
of the data, as the grid state object approach does. LyteNyte Grid version 2 reworks the grid's internals making the
grid stateless and prop driven. It does it in such a way that it does not compromise on the efficiency or flexibility
of the grid, whilst simultaneously enhancing the reactive capabilities of the grid.

As a concrete use case of this, consider the example where the row group expansions are maintained in the query params
of your application. In version 1 you would write some variant of the following code:

```tsx
const rowHeightParam = useRowHeightParam();

const grid = useLyteNyte({ rowHeight: rowHeightParam });

useEffect(() => {
  grid.state.rowHeight.set(rowHeightParam);
}, [grid, rowHeight]);

return <Grid.Root grid={grid}>{/*...other grid elements*/}</Grid.Root>;
```
