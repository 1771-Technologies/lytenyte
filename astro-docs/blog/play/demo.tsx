import { useState } from "react";

export default function Load() {
  const [count, setCount] = useState(0);
  return (
    <div className="border bg-red-500 px-2 py-2" onClick={() => setCount((prev) => prev + 1)}>
      {count}
    </div>
  );
}
