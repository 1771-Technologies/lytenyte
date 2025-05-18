import React, { type CSSProperties } from "react";

const skeletonStyle: CSSProperties = {
  display: "block",
  width: "80%",
  height: "60%",
  backgroundColor: "var(--lng1771-gray-05)",
  borderRadius: "8px",
  position: "relative",
  overflow: "hidden",
};

const shimmerStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage:
    "linear-gradient(90deg, var(--lng1771-gray-05) 0%, var(--lng1771-primary-10) 50%, var(--lng1771-gray-05) 100%)",
  animation: "lng1771-shimmer 1.5s infinite",
};

const Skeleton = ({ className = "" }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={skeletonStyle} className={className}>
        <div style={shimmerStyle}></div>
      </div>
    </div>
  );
};

export default Skeleton;
