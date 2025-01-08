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
        onInit={(el) => {
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
  return (
    <>
      <button {...t}>Alpha</button>
    </>
  );
}
