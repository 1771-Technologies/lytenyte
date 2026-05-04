/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Handle returned by `createAutoscroller` for controlling the scroll loop.
 */
export interface Autoscroller {
  /**
   * Sets the scroll direction for each axis. Pass -1, 0, or 1 for each.
   * Passing (0, 0) stops the loop. Changing direction while the loop is
   * running updates the direction without restarting or resetting velocity.
   */
  setDirection: (dirX: number, dirY: number) => void;
  /**
   * Immediately cancels the animation frame loop and resets velocity and
   * direction to zero. Safe to call when the loop is not running.
   */
  stop: () => void;
}

/**
 * Creates a rAF-driven autoscroller that accelerates a viewport element in a
 * given direction until it reaches `maxSpeed`, then scrolls at that constant
 * rate. Velocity resets to zero whenever the loop stops.
 *
 * Each frame the viewport is scrolled by the current velocity via
 * `scrollBy(velocityX, velocityY)` and `onScrolled` is called once, allowing
 * the caller to re-evaluate which cell is under the cursor and update the
 * active selection rect.
 */
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
