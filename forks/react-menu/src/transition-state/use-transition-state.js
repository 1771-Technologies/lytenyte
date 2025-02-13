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
import { useRef, useState, useEffect, useCallback } from "react";
import {
  PRE_ENTER,
  ENTERING,
  ENTERED,
  PRE_EXIT,
  EXITING,
  startOrEnd,
  getState,
  getEndStatus,
  getTimeout,
  nextTick,
} from "./utils";

const updateState = (status, setState, latestState, timeoutId, onChange) => {
  clearTimeout(timeoutId.current);
  const state = getState(status);
  setState(state);
  latestState.current = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  onChange && onChange({ current: state });
};

export const useTransitionState = ({
  enter = true,
  exit = true,
  preEnter,
  preExit,
  timeout,
  initialEntered,
  mountOnEnter,
  unmountOnExit,
  onStateChange: onChange,
} = {}) => {
  const [state, setState] = useState(() =>
    getState(initialEntered ? ENTERED : startOrEnd(mountOnEnter)),
  );
  const latestState = useRef(state);
  const timeoutId = useRef();
  const [enterTimeout, exitTimeout] = getTimeout(timeout);

  const endTransition = useCallback(() => {
    const status = getEndStatus(latestState.current._s, unmountOnExit);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    status && updateState(status, setState, latestState, timeoutId, onChange);
  }, [onChange, unmountOnExit]);

  const toggle = useCallback(
    (toEnter) => {
      const transitState = (status) => {
        updateState(status, setState, latestState, timeoutId, onChange);

        switch (status) {
          case ENTERING:
            if (enterTimeout >= 0) timeoutId.current = setTimeout(endTransition, enterTimeout);
            break;

          case EXITING:
            if (exitTimeout >= 0) timeoutId.current = setTimeout(endTransition, exitTimeout);
            break;

          case PRE_ENTER:
          case PRE_EXIT:
            timeoutId.current = nextTick(transitState, status);
            break;
        }
      };

      const enterStage = latestState.current.isEnter;
      if (typeof toEnter !== "boolean") toEnter = !enterStage;

      if (toEnter) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !enterStage && transitState(enter ? (preEnter ? PRE_ENTER : ENTERING) : ENTERED);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        enterStage &&
          transitState(exit ? (preExit ? PRE_EXIT : EXITING) : startOrEnd(unmountOnExit));
      }
    },
    [
      endTransition,
      onChange,
      enter,
      exit,
      preEnter,
      preExit,
      enterTimeout,
      exitTimeout,
      unmountOnExit,
    ],
  );

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  return [state, toggle, endTransition];
};
