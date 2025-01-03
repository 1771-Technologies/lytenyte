import type { Alignment, Axis, Placement, Side } from "./types";

export const getSide = (placement: Placement): Side => placement.split("-")[0] as Side;
export const getAlignment = (placement: Placement): Alignment | undefined =>
  placement.split("-")[1] as Alignment | undefined;

export const getAxis = (s: Side) => (["right", "left"].includes(s) ? "x" : "y");
export const getAlignmentAxis = (s: Side) => getOppositeAxis(getAxis(s));

export const getOppositeAxis = (s: Axis) => (s === "x" ? "y" : "x");
export const getAxisLength = (s: Axis) => (s === "y" ? "height" : "width");

export function getOppositePlacement(side: Side): Side {
  return {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }[side] as Side;
}
