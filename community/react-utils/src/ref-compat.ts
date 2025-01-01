import { forwardRef } from "react";
import { isReact19 } from "./is-react-19.js";

/**
 * Type for a component that can receive a ref
 */
type ComponentWithRef<P = any, T = any> = React.ComponentType<P & { ref?: React.Ref<T> }>;

/**
 * Wraps a component to handle ref forwarding consistently across React versions.
 * In React 18, uses forwardRef. In React 19+, passes ref directly as a prop.
 *
 * @param Component - The component to wrap
 * @param displayName - Optional display name for the wrapped component
 * @returns A component that handles refs appropriately for the current React version
 *
 * @example
 * // Basic usage
 * const MyButton = refWrap((props, ref) => (
 *   <button ref={ref} {...props} />
 * ));
 *
 * // With explicit types
 * const MyInput = refWrap<HTMLInputElement, { placeholder: string }>(
 *   (props, ref) => <input ref={ref} {...props} />
 * );
 */
export function refCompat<T, P = any>(
  Component: (props: P & { ref?: React.Ref<T> }) => React.ReactElement | null,
  displayName?: string,
): ComponentWithRef<P, T> {
  // For React 19+, return component as-is since it can handle refs directly
  if (isReact19()) {
    const WrappedComponent = Component as ComponentWithRef<P, T>;
    if (displayName) WrappedComponent.displayName = displayName;
    return WrappedComponent;
  }

  // For React 18 and below, use forwardRef
  const ForwardRefComponent = forwardRef<T, P>((props, ref) =>
    Component({ ...(props as P), ref }),
  ) as ComponentWithRef<P, T>;

  if (displayName) ForwardRefComponent.displayName = displayName;
  return ForwardRefComponent;
}
