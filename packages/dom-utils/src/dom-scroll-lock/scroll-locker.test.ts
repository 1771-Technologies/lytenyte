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

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ScrollLocker } from "./scroll-locker.js";
import { wait } from "@1771technologies/js-utils";

describe("ScrollLocker", () => {
  let locker: ScrollLocker;

  beforeEach(() => {
    locker = new ScrollLocker();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Should lock scroll on acquire and unlock on release", async () => {
    const release = locker.acquire(document.documentElement);
    await wait();

    expect(locker.restore).not.toBeNull();

    release();
    await wait();

    expect(locker.restore).toBeNull();
    expect(locker.lockCount).toEqual(0);
  });

  test("Should not unlock until all acquires are released", async () => {
    const release1 = locker.acquire(document.documentElement);
    const release2 = locker.acquire(document.documentElement);
    await wait();

    expect(locker.lockCount).toEqual(2);

    release1();
    await wait();

    expect(locker.restore).not.toBeNull();

    release2();
    await wait();

    expect(locker.restore).toBeNull();
    expect(locker.lockCount).toEqual(0);
  });

  test("Should not unlock when re-acquired before unlock fires", async () => {
    const release1 = locker.acquire(document.documentElement);
    await wait();

    release1();
    locker.acquire(document.documentElement);
    await wait();

    expect(locker.restore).not.toBeNull();

    locker.release();
    await wait();
  });

  test("Should skip lock when released before lock timeout fires", async () => {
    const release = locker.acquire(document.documentElement);
    release();
    await wait();

    expect(locker.restore).toBeNull();
  });

  test("Should skip lock when restore is already set when lock fires", async () => {
    const existingRestore = vi.fn();
    locker.acquire(document.documentElement);
    locker.restore = existingRestore;
    await wait();

    expect(locker.restore).toBe(existingRestore);

    locker.lockCount = 0;
    locker.restore = null;
  });

  test("Should set a no-op restore when html overflow is already hidden", async () => {
    document.documentElement.style.overflowY = "hidden";

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(locker.restore).not.toBeNull();

    release();
    await wait();

    document.documentElement.style.overflowY = "";
  });

  test("Should set a no-op restore when html overflow is clip", async () => {
    document.documentElement.style.overflowY = "clip";

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(locker.restore).not.toBeNull();

    release();
    await wait();

    document.documentElement.style.overflowY = "";
  });

  test("Should use basicPreventScroll on iOS", async () => {
    // @ts-expect-error this won't be defined in Firefox or Safari
    navigator.userAgentData ??= {};
    vi.spyOn(navigator as any, "userAgentData", "get").mockReturnValue({
      platform: "iPhone",
      mobile: true,
      brands: [],
    });

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(document.documentElement.style.overflow).toEqual("hidden");

    release();
    await wait();
  });

  test("Should use basicPreventScroll when not iOS and no inset scrollbars", async () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(0);

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(document.documentElement.style.overflow).toEqual("hidden");

    release();
    await wait();
  });

  test("Should use standardPreventScroll when not iOS and has inset scrollbars", async () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(9999);

    const release = locker.acquire(document.documentElement);
    await wait();

    expect(document.documentElement.getAttribute("data-ln-scroll-locked")).toEqual("");

    release();
    await wait();

    expect(document.documentElement.getAttribute("data-ln-scroll-locked")).toBeNull();
  });
});
