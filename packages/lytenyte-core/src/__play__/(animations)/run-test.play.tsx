import { useLayoutEffect, useState } from "react";

export default function RunTest() {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (!show) return;

    const el = document.querySelector("#x") as HTMLElement;

    el.animate([{ transform: `translateY(${200}px)` }, { transform: "translateY(0)" }], {
      duration: 300,
      easing: "ease-in-out",
      fill: "none",
    });
  }, [show]);

  return (
    <div>
      <button onClick={() => setShow((f) => !f)}>Show</button>

      {show && <div id="x">This is my content</div>}
    </div>
  );
}
