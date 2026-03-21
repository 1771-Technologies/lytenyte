export interface Autoscroller {
  setDirection: (dirX: number, dirY: number) => void;
  stop: () => void;
}

export function createAutoscroller(
  viewport: HTMLElement,
  maxSpeed: number,
  acceleration: number,
  onScrolled: () => void,
): Autoscroller {
  let velocityX = 0;
  let velocityY = 0;
  let dirX = 0;
  let dirY = 0;
  let frame: number | null = null;

  function loop() {
    velocityX = dirX !== 0 ? Math.min(Math.abs(velocityX) + acceleration, maxSpeed) * dirX : 0;
    velocityY = dirY !== 0 ? Math.min(Math.abs(velocityY) + acceleration, maxSpeed) * dirY : 0;

    if (velocityX !== 0 || velocityY !== 0) {
      viewport.scrollBy(velocityX, velocityY);
      onScrolled();
      frame = requestAnimationFrame(loop);
    } else {
      frame = null;
    }
  }

  function start() {
    if (frame !== null) return;
    frame = requestAnimationFrame(loop);
  }

  function stop() {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
    velocityX = 0;
    velocityY = 0;
    dirX = 0;
    dirY = 0;
  }

  function setDirection(newDirX: number, newDirY: number) {
    if (newDirX === dirX && newDirY === dirY) return;
    dirX = newDirX;
    dirY = newDirY;
    if (dirX !== 0 || dirY !== 0) start();
    else stop();
  }

  return { setDirection, stop };
}
