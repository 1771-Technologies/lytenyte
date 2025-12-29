import { useState } from "react";
import { Grid, useClientDataSource } from "../index.js";

const columns = Array.from({ length: 50 }, (_, i) => ({
  id: `${i}`,
  // rowSpan: i === 1 ? 3 : undefined,
  width: 30,
  widthMin: 30,
  field: i,

  uiHints: {
    resizable: true,
  },
}));

const data = Array.from({ length: 30_000 }, (_, r) => {
  return Array.from({ length: 50 }, (_, i) => (i === 0 ? r : Math.round(Math.random() * 100)));
});

export default function Component() {
  const [rtl, setRtl] = useState(false);
  const ds = useClientDataSource({
    data: data,
  });

  return (
    <div>
      <div>
        <button onClick={() => setRtl((prev) => !prev)}>RTL: {rtl ? "Yes" : "No"}</button>
      </div>

      <div className="ln-grid" style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Grid rtl={rtl} rowSource={ds} columns={columns} />
      </div>
    </div>
  );
}
