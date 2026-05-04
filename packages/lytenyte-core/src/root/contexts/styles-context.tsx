import { createContext, memo, useContext, useMemo, useRef, type PropsWithChildren } from "react";
import type { Root } from "../root.js";
import { equal } from "@1771technologies/js-utils";

interface StyleSettings {
  readonly rowAlternateAttr: boolean;
}

const context = createContext<Root.Props["styles"]>(null as any);
const contextSettings = createContext<StyleSettings>(null as any);

export const StylesProvider = memo(
  (
    props: PropsWithChildren<{
      styles: Root.Props["styles"];
      rowAlternateAttr: Root.Props["rowAlternateAttr"];
    }>,
  ) => {
    const prevStyles = useRef(props.styles);
    const styles = useMemo(() => {
      const next = props.styles;
      if (equal(prevStyles.current, next)) return prevStyles.current;

      prevStyles.current = next;
      return next;
    }, [props.styles]);

    const settings = useMemo(() => {
      return {
        rowAlternateAttr: props.rowAlternateAttr ?? true,
      } satisfies StyleSettings;
    }, [props.rowAlternateAttr]);

    return (
      <context.Provider value={styles}>
        <contextSettings.Provider value={settings}>{props.children}</contextSettings.Provider>
      </context.Provider>
    );
  },
);

export const useStyleContext = () => useContext(context);
export const useStyleSettings = () => useContext(contextSettings);
