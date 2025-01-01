# @1771technologies/react-cascada

React bindings for the Cascada state management library. This package provides optimized hooks and
integrations for using Cascada with React applications.

## Installation

```bash
npm install @1771technologies/react-cascada    # Using npm
pnpm add @1771technologies/react-cascada      # Using pnpm
bun add @1771technologies/react-cascada       # Using bun
yarn add @1771technologies/react-cascada      # Using yarn
```

## Quick Start

```typescript
import { signal, computed, cascada } from '@1771technologies/react-cascada';

// Create a store
const store = cascada(() => ({
  count: signal(0),
  doubled: computed(() => store.useValue('count') * 2)
}));

// Use in components
function Counter() {
  const count = store.useValue('count');
  const doubled = store.useValue('doubled');

  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => store.store.count.set(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Core Features

### Component-Local Stores

Create stores scoped to component lifecycles using the `useCascada` hook:

```typescript
import { signal, computed, useCascada } from '@1771technologies/react-cascada';

function Form() {
  const store = useCascada(() => ({
    name: signal(''),
    email: signal(''),
    isValid: computed(() => {
      const name = store.useValue('name');
      const email = store.useValue('email');
      return name.length > 0 && email.includes('@');
    })
  }));

  const name = store.useValue('name');
  const email = store.useValue('email');
  const isValid = store.useValue('isValid');

  return (
    <form>
      <input
        value={name}
        onChange={e => store.store.name.set(e.target.value)}
      />
      <input
        value={email}
        onChange={e => store.store.email.set(e.target.value)}
      />
      {!isValid && <span>Please fill all fields</span>}
    </form>
  );
}
```

### Efficient Selectors

Create optimized derived state with automatic dependency tracking:

```typescript
import { signal, cascada } from '@1771technologies/react-cascada';

const store = cascada(() => ({
  users: signal([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]),
  selectedId: signal<number | null>(null)
}));

function UserList() {
  // Efficiently compute derived state
  const selectedUser = store.useSelector(s => {
    const users = s.users.get();
    const id = s.selectedId.get();
    return users.find(u => u.id === id);
  });

  return (
    <div>
      <h2>Selected: {selectedUser?.name}</h2>
      <ul>
        {store.useValue('users').map(user => (
          <li
            key={user.id}
            onClick={() => store.store.selectedId.set(user.id)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## API Reference

### Exports

The package exports everything needed from Cascada along with React-specific additions:

```typescript
import {
  // Core Cascada exports
  signal,
  computed,
  remote,

  // React-specific exports
  cascada,
  useCascada,
} from "@1771technologies/react-cascada";
```

### cascada

Creates a React-optimized Cascada store:

```typescript
function cascada<F extends Record<string, AllSignalTypes<any>>>(fn: () => F): CascadaStore<F>;
```

### useCascada

Hook for creating component-scoped stores:

```typescript
function useCascada<F extends Record<string, AllSignalTypes<any>>>(fn: () => F): CascadaStore<F>;
```

### CascadaStore

Enhanced store type with React-specific features:

```typescript
interface CascadaStore<V> {
  store: V; // Raw store instance
  dispose: () => void; // Cleanup function
  use: <K extends keyof V>( // Hook to read signal values
    k: K,
  ) => ReturnType<V[K]["get"]>;
  useSelector: <T>( // Hook for derived state
    f: (s: V) => T,
    equal?: (l: T, r: T) => boolean,
  ) => T;
}
```

## Best Practices

1. **Component-Local State**

   - Use `useCascada` for state that belongs to a single component
   - Ensures proper cleanup on unmount

2. **Shared State**

   - Use `cascada` for state shared between components
   - Keep stores focused on specific domains

3. **Selectors**

   - Use `useSelector` for complex derived state
   - Provide custom equality functions for complex objects

4. **Performance**

   - Signals maintain referential stability
   - Computed values are cached
   - Updates are batched automatically

5. **Cleanup**
   - Stores created with `useCascada` clean up automatically
   - Call `dispose()` when manually created stores are no longer needed

## TypeScript Support

Full type inference and safety:

```typescript
import { signal, computed, cascada } from '@1771technologies/react-cascada';

interface User {
  id: number;
  name: string;
  email: string;
}

const store = cascada(() => ({
  users: signal<User[]>([]),
  selected: signal<number | null>(null),

  // Types are fully inferred
  current: computed(() => {
    const users = store.useValue('users');
    const id = store.useValue('selected');
    return users.find(u => u.id === id);
  })
}));

// Type safe component
function UserCard() {
  const user = store.useSelector(s => {
    const users = s.users.get();
    const id = s.selected.get();
    return users.find(u => u.id === id);
  });

  // TypeScript knows user might be undefined
  return user ? <div>{user.name}</div> : null;
}
```

## Contributing

Contributions are welcome! Please read our contributing guide for details on:

- Code of conduct
- Development process
- Pull request procedure
- Testing requirements

## License

Apache License 2.0
