import { useContext } from "react";
import { gridContext } from "./context.js";

export const useGrid = () => useContext(gridContext);
