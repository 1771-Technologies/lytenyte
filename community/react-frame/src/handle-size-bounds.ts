export function handleSizeBounds(x: number, y: number, w: number, h: number) {
  if (x < 0) x = 0;
  if (x + w > window.innerWidth) {
    let diff = x + w - window.innerWidth;
    if (x > diff) {
      x -= diff;
      diff = 0;
    } else {
      diff -= x;
      x = 0;
    }
    if (diff > 0) w -= diff;
  }
  if (y < 0) y = 0;
  if (y + h > window.innerHeight) {
    let diff = y + h - window.innerHeight;
    if (y > diff) {
      y -= diff;
      diff = 0;
    } else {
      diff -= y;
      y = 0;
    }
    if (diff > 0) h -= diff;
  }

  return { x, y, w, h };
}
