//! showLineNumbers
import { useState } from "react";

export default function Load() {
  const [count, setCount] = useState(0);
  //# start
  return (
    //! del="alpha" 2
    <div className="border px-2 py-2" onClick={() => setCount((prev) => prev + 1)}>
      {count}
    </div>
    //# end
  );
}
