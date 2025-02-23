export const defaultFocusIndex = -1;

export const defaultEqual = <T>(itemA: T | undefined, itemB: T | undefined) => itemA === itemB;

export const getId = (prefix: string | undefined, suffix: 'l' | 'i' | 'a' | number) =>
  prefix && prefix + suffix;

export const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
  tabIndex: -1,
  type: 'button'
};

export const getInputToggleProps = (
  id: string | undefined,
  open: boolean
): React.ButtonHTMLAttributes<HTMLButtonElement> => ({
  ...buttonProps,
  'aria-expanded': open,
  'aria-controls': getId(id, 'l')
});
