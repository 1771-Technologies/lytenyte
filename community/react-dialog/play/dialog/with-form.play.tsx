import { useState } from "react";
import { Dialog } from "../../src/index.js";

export default function WithForm() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      <Dialog open={open} onOpenChange={setOpen}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const select = document.querySelector("select")!;
            setValue(select.value);
            setOpen(false);
          }}
        >
          <p>
            <label>
              Favorite animal:
              <select>
                <option value="default">Choose…</option>
                <option>Brine shrimp</option>
                <option>Red panda</option>
                <option>Spider monkey</option>
              </select>
            </label>
          </p>
          <div>
            <button
              value="cancel"
              onClick={(e) => {
                e.preventDefault();
                setValue("Cancel");
                setOpen(false);
              }}
            >
              Cancel
            </button>
            <button id="confirmBtn" value="default">
              Confirm
            </button>
          </div>
        </form>
      </Dialog>
      <div>{value ? `Selected: ${value}` : "No Value Selected"}</div>
    </div>
  );
}
