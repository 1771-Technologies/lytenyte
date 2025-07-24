import { useContext } from "react";
import { gridContext } from "./context";

export const useGrid = () => useContext(gridContext);
