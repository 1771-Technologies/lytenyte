export type ArrowProps = React.SVGProps<SVGSVGElement>;

export const UpArrow: React.FC<ArrowProps> = (props) => (
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

export const DownArrow: React.FC<ArrowProps> = (props) => (
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

export const LeftArrow: React.FC<ArrowProps> = (props) => (
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

export const RightArrow: React.FC<ArrowProps> = (props) => (
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
