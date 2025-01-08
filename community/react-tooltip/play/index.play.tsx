import { TooltipProvider, useTooltip } from "../src/tooltip-provider";

export default function Home() {
  return (
    <div
      className={css`
        width: 500px;
        height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <TooltipProvider
        className={css`
          padding: 8px;
          background-color: black;
          color: white;
        `}
        arrowColor="black"
        onInit={(el) => {
          el.style.transition = "opacity 200ms linear";
          el.style.transitionDelay = "20ms";
          el.style.opacity = "0";
        }}
        onOpen={(el) => {
          el.style.opacity = "1";
        }}
        onClose={(el) => {
          el.style.opacity = "0";
        }}
      >
        <TooltipDemo />
      </TooltipProvider>
    </div>
  );
}

function TooltipDemo() {
  const t = useTooltip("x", <div>Showing content</div>);
  const beta = useTooltip("y", <div>Showing Beta</div>);
  return (
    <>
      <button {...t}>Alpha</button>
      <button {...beta}>Beta</button>
    </>
  );
}
