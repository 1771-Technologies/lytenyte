import { LyteNyteGrid } from "../src/lytenyte-grid-enterprise";
import { useLyteNyte } from "../src/use-lyte-nyte";

export default function Play() {
  const grid = useLyteNyte({
    gridId: "x",
    columns: [
      { id: "issue", headerName: "Issue No.", widthFlex: 2 },
      { id: "issue-title", headerName: "Issue Title", widthFlex: 2 },
      { id: "Raised On", headerName: "Raised On", widthFlex: 2 },
      { id: "Status", headerName: "Status", widthFlex: 2 },
      { id: "View", headerName: "View More", widthFlex: 2 },
    ],
  });

  return (
    <>
      <div
        className={css`
          position: fixed;
          top: 4px;
          height: 60px;
          width: 100%;
          background-color: rgba(0, 0, 222, 0.5);
        `}
      ></div>

      <div
        className={css`
          display: flex;
          flex-direction: column;
        `}
        style={{ width: "100vw", height: "100vh" }}
      >
        <div
          className={css`
            display: flex;
            align-items: center;
            gap: 4px;
          `}
        ></div>
        <div
          className={css`
            height: 400px;
          `}
        >
          <LyteNyteGrid grid={grid} />
        </div>
      </div>
    </>
  );
}
