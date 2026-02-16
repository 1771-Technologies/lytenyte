"use client";
import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro-experimental";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";

export default function ServerDataDemo() {
  const ds = useServerDataSource({
    queryKey: [],
    queryFn: async () => {
      return new Promise((res) => {
        void res;
      });
    },
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  return (
    <div className="lng-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={[]}
        slotViewportOverlay={
          isLoading && (
            <div className="bg-ln-gray-20/40 absolute left-0 top-0 z-20 h-full w-full animate-pulse"></div>
          )
        }
      />
    </div>
  );
}
