/**
 * 
The MIT License (MIT)

Copyright (c) 2021 Zheng Song

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
export const PRE_ENTER = 0;
export const ENTERING = 1;
export const ENTERED = 2;
export const PRE_EXIT = 3;
export const EXITING = 4;
export const EXITED = 5;
export const UNMOUNTED = 6;

export const STATUS = [
  "preEnter",
  "entering",
  "entered",
  "preExit",
  "exiting",
  "exited",
  "unmounted",
];

export const getState = (status) => ({
  _s: status,
  status: STATUS[status],
  isEnter: status < PRE_EXIT,
  isMounted: status !== UNMOUNTED,
  isResolved: status === ENTERED || status > EXITING,
});

export const startOrEnd = (unmounted) => (unmounted ? UNMOUNTED : EXITED);

export const getEndStatus = (status, unmountOnExit) => {
  switch (status) {
    case ENTERING:
    case PRE_ENTER:
      return ENTERED;

    case EXITING:
    case PRE_EXIT:
      return startOrEnd(unmountOnExit);
  }
};

export const getTimeout = (timeout) =>
  typeof timeout === "object" ? [timeout.enter, timeout.exit] : [timeout, timeout];

export const nextTick = (transitState, status) =>
  setTimeout(() => {
    // Reading document.body.offsetTop can force browser to repaint before transition to the next state
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isNaN(document.body.offsetTop) || transitState(status + 1);
  }, 0);
