/** Props type for arrow SVG components, extending standard SVG element props */
export type ArrowSvgProps = React.SVGProps<SVGSVGElement>;

/**
 * Renders an upward-pointing triangular arrow SVG.
 * @component
 * @param props - Standard SVG properties plus any additional props supported by SVG elements
 * @returns An SVG element representing an upward-pointing arrow
 * @example
 * ```tsx
 * <UpArrow className="text-blue-500" width={24} height={12} />
 * ```
 */
export const UpArrow: React.FC<ArrowSvgProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 8"
    {...props}
    width={16}
    height={8}
  >
    <path d="M8 0L16 8H0L8 0Z" />
  </svg>
);

/**
 * Renders a downward-pointing triangular arrow SVG.
 * @component
 * @param props - Standard SVG properties plus any additional props supported by SVG elements
 * @returns An SVG element representing a downward-pointing arrow
 * @example
 * ```tsx
 * <DownArrow className="text-blue-500" width={24} height={12} />
 * ```
 */
export const DownArrow: React.FC<ArrowSvgProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 16 8"
    {...props}
    width={16}
    height={8}
  >
    <path d="M8 8L0 0H16L8 8Z" />
  </svg>
);

/**
 * Renders a leftward-pointing triangular arrow SVG.
 * @component
 * @param props - Standard SVG properties plus any additional props supported by SVG elements
 * @returns An SVG element representing a leftward-pointing arrow
 * @example
 * ```tsx
 * <LeftArrow className="text-blue-500" width={12} height={24} />
 * ```
 */
export const LeftArrow: React.FC<ArrowSvgProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 8 16"
    {...props}
    width={8}
    height={16}
  >
    <path d="M8 8L0 0V16L8 8Z" />
  </svg>
);

/**
 * Renders a rightward-pointing triangular arrow SVG.
 * @component
 * @param props - Standard SVG properties plus any additional props supported by SVG elements
 * @returns An SVG element representing a rightward-pointing arrow
 * @example
 * ```tsx
 * <RightArrow className="text-blue-500" width={12} height={24} />
 * ```
 */
export const RightArrow: React.FC<ArrowSvgProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 8 16"
    {...props}
    width={8}
    height={16}
  >
    <path d="M0 8L8 0V16L0 8Z" />
  </svg>
);
