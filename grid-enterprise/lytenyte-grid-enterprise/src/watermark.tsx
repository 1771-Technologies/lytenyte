import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { hasAValidLicense } from "./license.js";
import { cascada, signal } from "@1771technologies/react-cascada";

const s = cascada(() => {
  return {
    showing: signal<string | null>(null),
  };
});

export function Watermark({ id }: { id: string }) {
  const showing = s.showing.use();

  const [mountable, setMountable] = useState(false);
  useEffect(() => {
    setMountable(true);
  }, []);

  useEffect(() => {
    if (showing && showing === id) s.showing.set(id);

    return () => s.showing.set(null);
  });

  useEffect(() => {
    if (hasAValidLicense) return;
    console.log(`
********************************************************************************
    No valid license was detected for the version of LyteNyte Grid being used.

    If you are only evaluating LyteNyte Grid you do not need to purchase license.

    For commercial use a license for developers must be purchased.

    Please visit https://1771technologies.com to learn more.
********************************************************************************
    `);
  }, []);

  if (!mountable) return null;

  if (hasAValidLicense) return null;

  if (showing && showing !== id) return null;
  if (typeof document === "undefined") return null;

  setTimeout(() => {
    s.showing.set(id);
  });

  return createPortal(
    <div
      className={css`
        position: fixed;
        bottom: 0px;
        inset-inline-end: 0px;
        background-color: #f2d5d5;
        border: 1px solid black;
        color: black;
        padding: 8px;
        border-radius: 4px;
        z-index: 200;
      `}
    >
      <div>
        <div
          style={{
            fontWeight: "bolder",
            fontSize: "1.25rem",
          }}
        >
          LyteNyte Grid for evaluation only.
          <a style={{ color: "blue" }} href="https://1771Technologies.com/pricing">
            Click here
          </a>{" "}
          to secure your license.
        </div>
      </div>
    </div>,

    document.body,
  );
}
