# @1771technologies/react-dialog

A lightweight, accessible React dialog component that wraps the native HTML `<dialog>` element.
This package provides a declarative API for modal dialogs with proper focus management,
keyboard interactions, and scroll locking.

## Features

- 🎯 Built on native `<dialog>` element
- ♿️ Full ARIA support and accessibility features
- 🔒 Automatic focus trap management
- ⌨️ Keyboard interaction handling (Escape to close)
- 📜 Scroll locking with width compensation
- 🔄 Proper focus restoration
- 🛡️ Handles browser extension edge cases
- 🎨 Minimal styling opinions
- 🪶 Lightweight with zero dependencies

## Installation

```bash
npm install @1771technologies/react-dialog
# or
yarn add @1771technologies/react-dialog
# or
pnpm add @1771technologies/react-dialog
# or
bun add @1771technologies/react-dialog
```

## Usage

```tsx
import { Dialog } from "@1771technologies/react-dialog";
import { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <h2>Dialog Title</h2>
        <p>Dialog content goes here...</p>
        <button onClick={() => setIsOpen(false)}>Close</button>
      </Dialog>
    </>
  );
}
```

## Props

### Required Props

- `open: boolean` - Controls the visibility state of the dialog
- `onOpenChange: (next: boolean) => void` - Callback function triggered when the dialog's
  open state should change

### Optional Props

The component accepts all valid HTML `<dialog>` element attributes.

## Features in Detail

### Focus Management

The dialog automatically manages focus by:

- Storing the previously focused element
- Trapping focus within the dialog when open
- Restoring focus when the dialog closes
- Handling edge cases with browser extensions that manipulate focus (e.g. Vimium)

### Scroll Locking

When the dialog opens:

- The main document's scroll is locked
- Scrollbar width is compensated to prevent layout shifts
- Scroll position is preserved

### Keyboard Interactions

- `Escape` key closes the dialog
- Tab key traps focus within the dialog
- Handles edge cases with browser extensions that modify keyboard behavior

### Click Outside

- Clicking outside the dialog boundary will trigger the `onOpenChange` callback

## Browser Support

This component relies on the native `<dialog>` element. Check
[caniuse.com](https://caniuse.com/?search=dialog) for browser compatibility.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache License 2.0

## Credits

Developed and maintained by 1771 Technologies.
