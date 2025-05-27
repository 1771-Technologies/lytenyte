import * as React from "react";

export interface ImageDifferProps {
  readonly expected: string;
  readonly actual: string;
}
export function ImageDiffer({ expected, actual }: ImageDifferProps) {
  return (
    <>
      <img src={expected} />
      <img src={actual} />
    </>
  );
}
