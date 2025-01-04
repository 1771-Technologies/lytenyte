export function getPreciseElementDimensions(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const styles = globalThis.getComputedStyle(element);

  const borderLeft = Number.parseFloat(styles.borderLeftWidth) || 0;
  const borderRight = Number.parseFloat(styles.borderRightWidth) || 0;
  const borderTop = Number.parseFloat(styles.borderTopWidth) || 0;
  const borderBottom = Number.parseFloat(styles.borderBottomWidth) || 0;

  const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
  const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;

  const scrollbarWidth = element.offsetWidth - element.clientWidth;
  const scrollbarHeight = element.offsetHeight - element.clientHeight;

  const innerWidth =
    rect.width - borderLeft - borderRight - paddingLeft - paddingRight - scrollbarWidth;
  const innerHeight =
    rect.height - borderTop - borderBottom - paddingTop - paddingBottom - scrollbarHeight;

  const outerWidth = rect.width;
  const outerHeight = rect.height;

  return { innerWidth, innerHeight, outerWidth, outerHeight };
}
