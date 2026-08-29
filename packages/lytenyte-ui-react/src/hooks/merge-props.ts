export function mergeProps(slotProps: Record<string, any>, childProps: Record<string, any>) {
  const finalProps = { ...childProps };

  for (const key in childProps) {
    const slotProp = slotProps[key];
    const childProp = childProps[key];
    const isHandler = /^on[A-Z1-9]/.test(key);

    if (isHandler && slotProp && childProp) {
      finalProps[key] = (...args: unknown[]) => {
        const result = childProp(...args);
        slotProp(...args);
        return result;
      };
    }

    if (key === "style") finalProps[key] = { ...slotProp, ...childProp };
    if (key === "className") finalProps[key] = [slotProp, childProp].filter(Boolean).join(" ");
  }

  return { ...slotProps, ...finalProps };
}
