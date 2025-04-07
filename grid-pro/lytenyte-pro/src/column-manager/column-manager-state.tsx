import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

interface ColumnManagerState {
  readonly query: string;
  readonly setQuery: Dispatch<SetStateAction<string>>;
}

const context = createContext(null as unknown as ColumnManagerState);

export const ColumnStateProvider = (props: PropsWithChildren) => {
  const [query, setQuery] = useState("");

  const value = useMemo(() => {
    return {
      query,
      setQuery,
    };
  }, [query]);

  return <context.Provider value={value}>{props.children}</context.Provider>;
};

export const useColumnManagerState = () => useContext(context);
