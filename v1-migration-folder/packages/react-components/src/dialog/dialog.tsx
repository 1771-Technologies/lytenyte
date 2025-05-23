import { useState } from "react";

export function Dialog() {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  return (
    <div>
      <button
        onClick={() => {
          dialog?.showModal();
        }}
      >
        Open Dialog
      </button>
      <dialog ref={setDialog}>This is my dialog content</dialog>
    </div>
  );
}
