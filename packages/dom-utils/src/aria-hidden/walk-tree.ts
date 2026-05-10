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

import { isHTMLElement } from "../predicates/index.js";
import { correctTargets } from "./correct-targets.js";
import { findControlledElements } from "./find-controlled-elements.js";
import { isIgnoredNode } from "./is-ignored-node.js";

interface WalkTreeOutsideOptions {
  parentNode: HTMLElement;
  markerName: string;
  controlAttribute: string;
  explicitBooleanValue: boolean;
  followControlledElements?: boolean;
}

let counterMap = new WeakMap<Element, number>();
let uncontrolledNodes = new WeakMap<Element, boolean>();
let markerMap: Record<string, WeakMap<Element, number>> = {};
let lockCount = 0;

export const walkTreeOutside = (
  originalTarget: Element | Element[],
  props: WalkTreeOutsideOptions,
): VoidFunction => {
  const {
    parentNode,
    markerName,
    controlAttribute,
    explicitBooleanValue,
    followControlledElements = true,
  } = props;
  const targets = correctTargets(
    parentNode,
    Array.isArray(originalTarget) ? originalTarget : [originalTarget],
  );

  markerMap[markerName] ||= new WeakMap();
  const markerCounter = markerMap[markerName];

  const hiddenNodes: Element[] = [];
  const elementsToKeep = new Set<Node>();
  const elementsToStop = new Set<Node>(targets);

  const keep = (el: Node | undefined) => {
    if (!el || elementsToKeep.has(el)) return;
    elementsToKeep.add(el);
    keep(el.parentNode!);
  };

  targets.forEach((target) => {
    keep(target);
    // Also keep any elements that are controlled by elements within the target
    if (followControlledElements && isHTMLElement(target)) {
      findControlledElements(target, (controlledElement) => {
        keep(controlledElement);
      });
    }
  });

  const deep = (parent: Element | null) => {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }

    Array.prototype.forEach.call(parent.children, (node: Element) => {
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        try {
          if (isIgnoredNode(node)) return;
          const attr = node.getAttribute(controlAttribute);
          const alreadyHidden = explicitBooleanValue ? attr === "true" : attr !== null && attr !== "false";
          const counterValue = (counterMap.get(node) || 0) + 1;
          const markerValue = (markerCounter.get(node) || 0) + 1;

          counterMap.set(node, counterValue);
          markerCounter.set(node, markerValue);
          hiddenNodes.push(node);

          if (counterValue === 1 && alreadyHidden) {
            uncontrolledNodes.set(node, true);
          }

          if (markerValue === 1) {
            node.setAttribute(markerName, "");
          }

          if (!alreadyHidden) {
            node.setAttribute(controlAttribute, explicitBooleanValue ? "true" : "");
          }
        } catch (e) {
          console.error("[ariaHidden] cannot operate on ", node, e);
        }
      }
    });
  };

  deep(parentNode);
  elementsToKeep.clear();

  lockCount++;

  return () => {
    hiddenNodes.forEach((node) => {
      const counterValue = counterMap.get(node)! - 1;
      const markerValue = markerCounter.get(node)! - 1;

      counterMap.set(node, counterValue);
      markerCounter.set(node, markerValue);

      if (!counterValue) {
        if (!uncontrolledNodes.has(node)) {
          node.removeAttribute(controlAttribute);
        }
        uncontrolledNodes.delete(node);
      }

      if (!markerValue) {
        node.removeAttribute(markerName);
      }
    });

    lockCount--;

    if (!lockCount) {
      // clear
      counterMap = new WeakMap();
      counterMap = new WeakMap();
      uncontrolledNodes = new WeakMap();
      markerMap = {};
    }
  };
};
