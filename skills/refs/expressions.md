# Expressions (PRO)

LyteNyte Grid provides a lightweight DSL (domain-specific language) for building evaluatable expressions. Common uses: complex filter UIs, computed column fields, custom query builders.

## Import

```ts
import { Evaluator, standardPlugins, createResolvedIdentifierPlugin } from "@1771technologies/lytenyte-pro/expressions";
```

## Basic Evaluation

```ts
const evaluator = new Evaluator();
const result = evaluator.run("1 + 1");  // 2
```

## Standard Plugins (JavaScript-like syntax)

```ts
const evaluator = new Evaluator(standardPlugins);

evaluator.run("1 + 2 * 3");                         // 7
evaluator.run("true && false");                      // false
evaluator.run("\"hello\".includes(\"ell\")");        // true
evaluator.run("x > 10", { x: 15 });                 // true — context provides variables
evaluator.run("greet(name)", { greet: (n) => `Hello ${n}`, name: "World" }); // "Hello World"
```

Context can contain primitives, functions, objects — anything the expression needs.

## Evaluation Flow

1. **Tokenize** → `evaluator.tokens("expr")` or `evaluator.tokensSafe("expr")`
2. **Parse** → `evaluator.ast("expr")` — returns the AST
3. **Evaluate** → `evaluator.run("expr", context)` — runs all three steps

## ExpressionEditor Component

Provides a styled single-line input with syntax highlighting and autocomplete:

```tsx
import { ExpressionEditor, createCompletionProvider } from "@1771technologies/lytenyte-pro/expressions";

function FilterInput({ value, onChange, context }) {
  const tokenizer = useMemo(() => new Evaluator(standardPlugins), []);
  const completionProvider = useMemo(
    () => createCompletionProvider(context),
    [context]
  );

  return (
    <ExpressionEditor
      value={value}
      onChange={onChange}
      tokenizer={tokenizer}
      completionProvider={completionProvider}
    />
  );
}
```

### Custom Completion Provider

```ts
type CompletionProvider = (
  tokens: Token[],
  cursorPosition: number,  // current token index
) => CompletionItem[] | Promise<CompletionItem[]>;
```

## Expression Filters

Use expressions as filter predicates. The `createResolvedIdentifierPlugin` makes column names behave as implicit function calls (no parentheses needed in expressions):

```ts
const evaluator = new Evaluator(
  standardPlugins.concat([
    createResolvedIdentifierPlugin({
      args: ["row"],
      identifiers: columns.map(c => c.name ?? c.id),
    }),
  ])
);

// Users can now write: Gender == "Male" && Quantity > 10
// Instead of: Gender("row") == "Male" && Quantity("row") > 10
```

Wire to the client data source filter:

```ts
const [expression, setExpression] = useState("Gender == \"Male\"");

const filterFn = useMemo(() => {
  if (!expression.trim()) return null;

  // Build context: each column name maps to a function that reads its value from the row
  const context = Object.fromEntries(
    columns.map(col => [
      col.name ?? col.id,
      (row: Grid.T.RowLeaf<GridSpec["data"]>) => api.columnField(col, row),
    ])
  );

  return (row: Grid.T.RowLeaf<GridSpec["data"]>) => {
    try {
      return Boolean(evaluator.run(expression, { ...context, row }));
    } catch {
      return true; // invalid expression — show all rows
    }
  };
}, [expression, columns, evaluator]);

const ds = useClientDataSource({ data, filter: filterFn });
```

**Performance note:** Expression evaluation is slower than a hardcoded predicate (extra AST traversal step). For large datasets, consider debouncing expression input.

**Server-side note:** The AST from `evaluator.ast("expr")` is JSON-serializable (unless you use custom plugins with non-serializable nodes). Send it to the server for server-side evaluation.

## Custom Plugins

A `Plugin` implements any subset of the pipeline:

```ts
interface Plugin {
  name: string;
  scan?: (source: string, pos: number) => { type: string; value: string; end: number } | null;
  parsePrefix?: (ctx: ParserContext) => ASTNode | null;
  parseInfix?: (ctx: ParserContext, left: ASTNode, minPrec: number) => ASTNode | null;
  parsePostfix?: (ctx: ParserContext, node: ASTNode) => ASTNode | null;
  parseUnary?: (ctx: ParserContext, parseNext: (ctx: ParserContext) => ASTNode) => ASTNode | null;
  infixPrecedence?: (ctx: ParserContext) => number | undefined;
  optimize?: (node: ASTNode, optimize: (n: ASTNode) => ASTNode) => ASTNode | null;
  evaluate?: (node: ASTNode, context: Record<string, unknown>, evaluate: EvalFn) => { value: unknown } | null;
}

const myPlugin: Plugin = {
  name: "my-plugin",
  evaluate: (node, context, evaluate) => {
    if (node.type !== "MyNodeType") return null;
    return { value: /* compute value */ };
  },
};

const evaluator = new Evaluator([...standardPlugins, myPlugin]);
```

## Gotchas

- **`createResolvedIdentifierPlugin` identifiers must match exactly** — the plugin maps identifier tokens to function calls. If a column name contains spaces or special characters, those characters are not valid identifier tokens. Use column ids (which are typically camelCase or snake_case) rather than display names, or ensure names are identifier-safe.
- **Always wrap `evaluator.run()` in a try/catch for user input** — user-typed expressions can contain syntax errors. A malformed expression throws, not returns null. Return `true` (show all rows) or `false` on error depending on your desired behavior.
- **The `Evaluator` instance should be memoized** — creating a new `Evaluator` on each render is wasteful. Wrap in `useMemo` with the plugins array as dependency.
- **AST serialization: custom plugins may produce non-serializable nodes** — `standardPlugins` produces a JSON-serializable AST. Custom plugins that store function references or class instances in AST nodes will break `JSON.stringify`. Keep AST nodes as plain objects.

## Full Docs

- [Expressions Overview](/docs/expressions-overview)
- [Expression Plugins](/docs/expression-plugins)
- [Expression Filters](/docs/expression-filters)
