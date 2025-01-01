# @1771technologies/Cascada

A lightweight, type-safe reactive state management library for TypeScript applications.
Cascada provides a simple yet powerful way to manage application state using signals, computed values,
and remote data sources, with a focus on predictable lifecycle management and memory safety.

## Overview

Cascada is a state management library specifically designed for managing client-side application
state. It uses a fine-grained reactive approach based on signals and computed values, with a focus
on well-defined, predictable state management rather than general-purpose UI reactivity.

## Key Features

- 🎯 **Type-Safe Signals**: Reactive state containers with full TypeScript inference
- 🧮 **Computed Values**: Automatically derived state with lazy evaluation and caching
- 🌐 **Remote Sources**: Seamless integration with external data sources and subscriptions
- 🎭 **Scoped Reactivity**: Predictable state management with automatic cleanup
- 📦 **Zero Dependencies**: Lightweight and self-contained (~2KB gzipped)
- 🔍 **Memory Safe**: Deterministic cleanup and leak prevention
- ⚡ **High Performance**: Fine-grained updates with batched processing

## Installation

```bash
npm install @1771technologies/cascada    # Using npm
pnpm add @1771technologies/cascada      # Using pnpm
bun add @1771technologies/cascada       # Using bun
```

## Quick Start

```typescript
import { cascada, signal, computed } from "cascada";

// Create a reactive store
const { store, dispose } = cascada(() => {
  // Define your state
  const count = signal(0);
  const doubled = computed(() => count.get() * 2);

  return { count, doubled };
});

// Use your store
console.log(store.count.get()); // 0
store.count.set(5);
console.log(store.doubled.get()); // 10

// Clean up when done
dispose();
```

## Core Concepts

### 1. Signals

Signals provide reactive state with dependency-free reading:

```typescript
const { store } = cascada(() => {
  const count = signal(0);

  // Reading values
  const value = count.get(); // Creates a dependency
  const snap = count.peek(); // Reads without creating a dependency

  // Updating values
  count.set(5); // Direct update
  count.set((prev) => prev + 1); // Using updater function

  // Watch for changes
  count.watch(() => console.log("Count changed:", count.get()));

  // Custom equality for complex objects
  const user = signal(
    { id: 1, name: "Alice" },
    {
      equal: (a, b) => a.id === b.id,
    },
  );

  return { count, user };
});
```

### 2. Computed Values

Create derived state that automatically updates and caches:

```typescript
const { store } = cascada(() => {
  const items = signal([1, 2, 3, 4]);
  const filter = signal("even");

  // Read-only computed value
  const filtered = computed(() => {
    const list = items.get();
    const type = filter.get();

    return type === "even" ? list.filter((n) => n % 2 === 0) : list.filter((n) => n % 2 !== 0);
  });

  // Writable computed value with two-way binding
  const celsius = signal(0);
  const fahrenheit = computed(
    () => (celsius.get() * 9) / 5 + 32,
    (f) => celsius.set(((f - 32) * 5) / 9),
  );

  // Can both read and write the computed value
  console.log(fahrenheit.get()); // 32
  fahrenheit.set(68); // Updates celsius to 20

  return { items, filter, filtered, celsius, fahrenheit };
});
```

### 3. Remote Sources

Integrate with external data and handle subscriptions:

```typescript
const { store } = cascada(() => {
  // Read-only remote source
  const time = remote({
    get: () => Date.now(),
    subscribe: (callback) => {
      const interval = setInterval(callback, 1000);
      return () => clearInterval(interval);
    },
  });

  // Writable remote source
  const todoList = remote({
    get: () => fetch("/api/todos").then((r) => r.json()),
    set: (todos) =>
      fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(todos),
      }),
    subscribe: (callback) => {
      const ws = new WebSocket("/api/todos/updates");
      ws.onmessage = callback;
      return () => ws.close();
    },
  });

  return { time, todoList };
});
```

## Advanced Features

### Reading Without Dependencies

The `peek` method allows reading values without creating reactive dependencies:

```typescript
const { store } = cascada(() => {
  const count = signal(0);

  const total = computed(() => {
    // Using peek() here means this computation won't
    // rerun when count changes
    const currentCount = count.peek();

    // Do expensive calculation
    return heavyCalculation(currentCount);
  });

  // Useful for debugging or logging without side effects
  count.watch(() => {
    console.log("New value:", count.peek());
  });

  return { count, total };
});
```

### Store Selectors

Create computed values that span multiple signals:

```typescript
const { store, selector } = cascada(() => ({
  users: signal([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]),
  selectedId: signal<number | null>(null),
}));

// Automatically updates when users or selectedId changes
const selectedUser = selector((s) => {
  const id = s.selectedId.get();
  return id ? s.users.get().find((u) => u.id === id) : null;
});
```

### Resource Management

All resources are automatically tracked and cleaned up:

```typescript
const { store, dispose } = cascada(() => {
  // Everything is tracked:
  // - Signal subscriptions
  // - Computed dependencies
  // - Remote source cleanup
  // - Selector computations
  const data = signal([]);
  const filtered = computed(() => data.get().filter((x) => x > 0));
  const remote = remote({
    /*...*/
  });

  return { data, filtered, remote };
});

// Later: clean up everything
dispose();
```

## Best Practices

1. **Define Clear Boundaries**: Keep stores focused on specific domains
2. **Leverage Computation**: Use computed values instead of manual watches
3. **Handle Cleanup**: Always call dispose when stores are no longer needed
4. **Type Everything**: Use TypeScript for better maintainability
5. **Custom Equality**: Implement proper equality checks for complex objects
6. **Batch Updates**: Group related updates to minimize recomputation
7. **Use Selectors**: Create efficient derived state with selectors

## TypeScript Support

Full type inference and safety:

```typescript
interface User {
  id: number;
  name: string;
  preferences: {
    theme: "light" | "dark";
    fontSize: number;
  };
}

const { store } = cascada(() => {
  // Full type inference and validation
  const user = signal<User>({
    id: 1,
    name: "Alice",
    preferences: { theme: "dark", fontSize: 14 },
  });

  // TypeScript catches errors
  const theme = computed(() => user.get().preferences.theme);

  return { user, theme };
});
```

## When to Use Cascada

### Good Fits

- Application state management
- Form state and validation
- Data synchronization
- Complex state derivations
- Memory-critical applications

### Consider Alternatives For

- UI-specific reactivity (use UI frameworks)
- Global singleton state (use Redux/Zustand)
- Simple component state (use framework state)
- Dynamic dependency graphs

## Contributing

Contributions are welcome! Please read our contributing guide for details on:

- Code of conduct
- Development process
- Pull request procedure
- Testing requirements

## License

Apache License 2.0
