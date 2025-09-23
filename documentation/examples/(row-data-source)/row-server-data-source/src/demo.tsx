"use client";

import dynamic from "next/dynamic";

const RowServerDataSource = dynamic(() => import("./component").then((r) => r.default), {
  ssr: false,
});

export default RowServerDataSource;
