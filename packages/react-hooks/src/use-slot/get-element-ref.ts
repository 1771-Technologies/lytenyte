import type { ReactElement } from "react";
import { isReactVersionAtLeast } from "../react-version.js";

export function getElementRef(element: ReactElement) {
  // React <=18 in DEV
  if (isReactVersionAtLeast(18)) {
    const getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    const mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return (element as any).ref;
    }
  }
  if (isReactVersionAtLeast(19)) {
    const getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    const mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return (element.props as { ref?: React.Ref<unknown> }).ref;
    }
  }

  // Not DEV
  return (element.props as { ref?: React.Ref<unknown> }).ref || (element as any).ref;
}
