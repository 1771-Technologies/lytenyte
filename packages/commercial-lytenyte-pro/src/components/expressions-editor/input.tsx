import { forwardRef, memo, type JSX } from "react";
import { useExpressionRoot } from "./context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";

function EditorInputImpl(props: EditorInput.Props, forwarded: EditorInput.Props["ref"]) {
  const { inputRef, inputProps } = useExpressionRoot();

  const ref = useCombinedRefs(forwarded, inputRef);

  return (
    <textarea
      data-ln-expression-input
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      wrap="off"
      rows={1}
      {...props}
      {...inputProps}
      ref={ref}
    />
  );
}

export const EditorInput = memo(forwardRef(EditorInputImpl));

export namespace EditorInput {
  type OmittedProps = "value" | "onChange" | "onKeyDown" | "onSelect" | "onScroll";
  export type Props = Omit<JSX.IntrinsicElements["textarea"], OmittedProps>;
}
