import React from "react";
import { isFocusable } from "@1771technologies/lytenyte-focus";
import { createFocusTrap } from "./focus-trap.js";

/**
 * The major version of React currently running.
 * @type {number}
 */
const reactVerMajor = parseInt(/^(\d+)\./.exec(React.version)?.[1] ?? 0, 10);

/**
 * @type {import('../index.d.ts').FocusTrap}
 */
export class FocusTrap extends React.Component {
  constructor(props) {
    super(props);

    this.handleDeactivate = this.handleDeactivate.bind(this);
    this.handlePostDeactivate = this.handlePostDeactivate.bind(this);
    this.handleClickOutsideDeactivates = this.handleClickOutsideDeactivates.bind(this);

    // focus-trap options used internally when creating the trap
    this.internalOptions = {
      // We need to hijack the returnFocusOnDeactivate option,
      // because React can move focus into the element before we arrived at
      // this lifecycle hook (e.g. with autoFocus inputs). So the component
      // captures the previouslyFocusedElement in componentWillMount,
      // then (optionally) returns focus to it in componentWillUnmount.
      returnFocusOnDeactivate: false,

      // the rest of these are also related to deactivation of the trap, and we
      //  need to use them and control them as well
      checkCanReturnFocus: null,
      onDeactivate: this.handleDeactivate,
      onPostDeactivate: this.handlePostDeactivate,

      // we need to special-case this setting as well so that we can know if we should
      //  NOT return focus if the trap gets auto-deactivated as the result of an
      //  outside click (otherwise, we'll always think we should return focus because
      //  of how we manage that flag internally here)
      clickOutsideDeactivates: this.handleClickOutsideDeactivates,
    };

    // original options provided by the consumer
    this.originalOptions = {
      // because of the above `internalOptions`, we maintain our own flag for
      //  this option, and default it to `true` because that's focus-trap's default
      returnFocusOnDeactivate: true,

      // because of the above `internalOptions`, we keep these separate since
      //  they're part of the deactivation process which we configure (internally) to
      //  be shared between focus-trap and focus-trap-react
      onDeactivate: null,
      onPostDeactivate: null,
      checkCanReturnFocus: null,

      // the user's setting, defaulted to false since focus-trap defaults this to false
      clickOutsideDeactivates: false,
    };

    const { focusTrapOptions } = props;
    for (const optionName in focusTrapOptions) {
      if (!Object.prototype.hasOwnProperty.call(focusTrapOptions, optionName)) {
        continue;
      }

      if (
        optionName === "returnFocusOnDeactivate" ||
        optionName === "onDeactivate" ||
        optionName === "onPostDeactivate" ||
        optionName === "checkCanReturnFocus" ||
        optionName === "clickOutsideDeactivates"
      ) {
        this.originalOptions[optionName] = focusTrapOptions[optionName];
        continue; // exclude from internalOptions
      }

      this.internalOptions[optionName] = focusTrapOptions[optionName];
    }

    // if set, `{ target: Node, allowDeactivation: boolean }` where `target` is the outside
    //  node that was clicked, and `allowDeactivation` is the result of the consumer's
    //  option (stored in `this.originalOptions.clickOutsideDeactivates`, which may be a
    //  function) whether to allow or deny auto-deactivation on click on this outside node
    this.outsideClick = null;

    // elements from which to create the focus trap on mount; if a child is used
    //  instead of the `containerElements` prop, we'll get the child's related
    //  element when the trap renders and then is declared 'mounted'
    this.focusTrapElements = props.containerElements || [];

    // now we remember what the currently focused element is, not relying on focus-trap
    this.updatePreviousElement();
  }

  /**
   * Gets the configured document.
   * @returns {Document|undefined} Configured document, falling back to the main
   *  document, if it exists. During SSR, `undefined` is returned since the
   *  document doesn't exist.
   */
  getDocument() {
    // SSR: careful to check if `document` exists before accessing it as a variable
    return (
      this.props.focusTrapOptions.document ||
      (typeof document !== "undefined" ? document : undefined)
    );
  }

  /**
   * Gets the node for the given option, which is expected to be an option that
   *  can be either a DOM node, a string that is a selector to get a node, `false`
   *  (if a node is explicitly NOT given), or a function that returns any of these
   *  values.
   * @param {string} optionName
   * @returns {undefined | false | HTMLElement | SVGElement} Returns
   *  `undefined` if the option is not specified; `false` if the option
   *  resolved to `false` (node explicitly not given); otherwise, the resolved
   *  DOM node.
   * @throws {Error} If the option is set, not `false`, and is not, or does not
   *  resolve to a node.
   */
  getNodeForOption = function (optionName, ...params) {
    // use internal options first, falling back to original options
    let optionValue = this.internalOptions[optionName] ?? this.originalOptions[optionName];

    if (typeof optionValue === "function") {
      optionValue = optionValue(...params);
    }

    if (optionValue === true) {
      optionValue = undefined; // use default value
    }

    if (!optionValue) {
      if (optionValue === undefined || optionValue === false) {
        return optionValue;
      }
      // else, empty string (invalid), null (invalid), 0 (invalid)

      throw new Error(
        `\`${optionName}\` was specified but was not a node, or did not return a node`,
      );
    }

    let node = optionValue; // could be HTMLElement, SVGElement, or non-empty string at this point

    if (typeof optionValue === "string") {
      node = this.getDocument()?.querySelector(optionValue); // resolve to node, or null if fails
      if (!node) {
        throw new Error(`\`${optionName}\` as selector refers to no known node`);
      }
    }

    return node;
  };

  getReturnFocusNode() {
    const node = this.getNodeForOption("setReturnFocus", this.previouslyFocusedElement);
    return node ? node : node === false ? false : this.previouslyFocusedElement;
  }

  /** Update the previously focused element with the currently focused element. */
  updatePreviousElement() {
    const currentDocument = this.getDocument();
    if (currentDocument) {
      this.previouslyFocusedElement = currentDocument.activeElement;
    }
  }

  deactivateTrap() {
    // NOTE: it's possible the focus trap has already been deactivated without our knowing it,
    //  especially if the user set the `clickOutsideDeactivates: true` option on the trap,
    //  and the mouse was clicked on some element outside the trap; at that point, focus-trap
    //  will initiate its auto-deactivation process, which will call our own
    //  handleDeactivate(), which will call into this method
    if (!this.focusTrap || !this.focusTrap.active) {
      return;
    }

    this.focusTrap.deactivate({
      // NOTE: we never let the trap return the focus since we do that ourselves
      returnFocus: false,
      // we'll call this in our own post deactivate handler so make sure the trap doesn't
      //  do it prematurely
      checkCanReturnFocus: null,
      // let it call the user's original deactivate handler, if any, instead of
      //  our own which calls back into this function
      onDeactivate: this.originalOptions.onDeactivate,
      // NOTE: for post deactivate, don't specify anything so that it calls the
      //  onPostDeactivate handler specified on `this.internalOptions`
      //  which will always be our own `handlePostDeactivate()` handler, which
      //  will finish things off by calling the user's provided onPostDeactivate
      //  handler, if any, at the right time
      // onPostDeactivate: NOTHING
    });
  }

  handleClickOutsideDeactivates(event) {
    // use consumer's option (or call their handler) as the permission or denial
    const allowDeactivation =
      typeof this.originalOptions.clickOutsideDeactivates === "function"
        ? this.originalOptions.clickOutsideDeactivates.call(null, event) // call out of context
        : this.originalOptions.clickOutsideDeactivates; // boolean

    if (allowDeactivation) {
      // capture the outside target that was clicked so we can use it in the deactivation
      //  process since the consumer allowed it to cause auto-deactivation
      this.outsideClick = {
        target: event.target,
        allowDeactivation,
      };
    }

    return allowDeactivation;
  }

  handleDeactivate() {
    if (this.originalOptions.onDeactivate) {
      this.originalOptions.onDeactivate.call(null); // call user's handler out of context
    }
    this.deactivateTrap();
  }

  handlePostDeactivate() {
    const finishDeactivation = () => {
      const returnFocusNode = this.getReturnFocusNode();
      const canReturnFocus = !!(
        // did the consumer allow it?
        (
          this.originalOptions.returnFocusOnDeactivate &&
          // can we actually focus the node?
          returnFocusNode?.focus &&
          // was there an outside click that allowed deactivation?
          (!this.outsideClick ||
            // did the consumer allow deactivation when the outside node was clicked?
            (this.outsideClick.allowDeactivation &&
              // is the outside node NOT focusable (implying that it did NOT receive focus
              //  as a result of the click-through) -- in which case do NOT restore focus
              //  to `returnFocusNode` because focus should remain on the outside node
              !isFocusable(this.outsideClick.target, this.internalOptions.tabbableOptions)))
        )
        // if no, the restore focus to `returnFocusNode` at this point
      );
      const { preventScroll = false } = this.internalOptions;

      if (canReturnFocus) {
        // return focus to the element that had focus when the trap was activated
        returnFocusNode.focus({
          preventScroll,
        });
      }

      if (this.originalOptions.onPostDeactivate) {
        this.originalOptions.onPostDeactivate.call(null); // don't call it in context of "this"
      }

      this.outsideClick = null; // reset: no longer needed
    };

    if (this.originalOptions.checkCanReturnFocus) {
      this.originalOptions.checkCanReturnFocus
        .call(null, this.getReturnFocusNode()) // call out of context
        .then(finishDeactivation, finishDeactivation);
    } else {
      finishDeactivation();
    }
  }

  setupFocusTrap() {
    if (this.focusTrap) {
      // trap already exists: it's possible we're in StrictMode and we're being remounted,
      //  in which case, we will have deactivated the trap when we got unmounted (remember,
      //  StrictMode, in development, purposely unmounts and remounts components after
      //  mounting them the first time to make sure they have reusable state,
      //  @see https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state) so now
      //  we need to restore the state of the trap according to our component state
      // NOTE: Strict mode __violates__ assumptions about the `componentWillUnmount()` API
      //  which clearly states -- even for React 18 -- that, "Once a component instance is
      //  unmounted, __it will never be mounted again.__" (emphasis ours). So when we get
      //  unmounted, we assume we're gone forever and we deactivate the trap. But then
      //  we get remounted and we're supposed to restore state. But if you had paused,
      //  we've now deactivated (we don't know we're amount to get remounted again)
      //  which means we need to reactivate and then pause. Otherwise, do nothing.
      if (this.props.active && !this.focusTrap.active) {
        this.focusTrap.activate();
        if (this.props.paused) {
          this.focusTrap.pause();
        }
      }
    } else {
      const nodesExist = this.focusTrapElements.some(Boolean);
      if (nodesExist) {
        this.focusTrap = this.props._createFocusTrap(this.focusTrapElements, this.internalOptions);

        if (this.props.active) {
          this.focusTrap.activate();
        }

        if (this.props.paused) {
          this.focusTrap.pause();
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.active) {
      this.setupFocusTrap();
    }
    // else, wait for later activation in case the `focusTrapOptions` will be updated
    //  again before the trap is activated (e.g. if waiting to know what the document
    //  object will be, so the Trap must be rendered, but the consumer is waiting to
    //  activate until they have obtained the document from a ref)
    //  @see https://github.com/focus-trap/focus-trap-react/issues/539
  }

  componentDidUpdate(prevProps) {
    if (this.focusTrap) {
      if (prevProps.containerElements !== this.props.containerElements) {
        this.focusTrap.updateContainerElements(this.props.containerElements);
      }

      const hasActivated = !prevProps.active && this.props.active;
      const hasDeactivated = prevProps.active && !this.props.active;
      const hasPaused = !prevProps.paused && this.props.paused;
      const hasUnpaused = prevProps.paused && !this.props.paused;

      if (hasActivated) {
        this.updatePreviousElement();
        this.focusTrap.activate();
      }

      if (hasDeactivated) {
        this.deactivateTrap();
        return; // un/pause does nothing on an inactive trap
      }

      if (hasPaused) {
        this.focusTrap.pause();
      }

      if (hasUnpaused) {
        this.focusTrap.unpause();
      }
    } else {
      // NOTE: if we're in `componentDidUpdate` and we don't have a trap yet,
      //  it either means it shouldn't be active, or it should be but none of
      //  of given `containerElements` were present in the DOM the last time
      //  we tried to create the trap

      if (prevProps.containerElements !== this.props.containerElements) {
        this.focusTrapElements = this.props.containerElements;
      }

      // don't create the trap unless it should be active in case the consumer
      //  is still updating `focusTrapOptions`
      //  @see https://github.com/focus-trap/focus-trap-react/issues/539
      if (this.props.active) {
        this.updatePreviousElement();
        this.setupFocusTrap();
      }
    }
  }

  componentWillUnmount() {
    this.deactivateTrap();
  }

  render() {
    const child = this.props.children ? React.Children.only(this.props.children) : undefined;

    if (child) {
      if (child.type && child.type === React.Fragment) {
        throw new Error(
          "A focus-trap cannot use a Fragment as its child container. Try replacing it with a <div> element.",
        );
      }

      const callbackRef = (element) => {
        const { containerElements } = this.props;

        if (child) {
          // React 19 moved the `ref` to an official prop
          if (reactVerMajor >= 19) {
            if (typeof child.props.ref === "function") {
              child.props.ref(element);
            } else if (child.props.ref) {
              child.props.ref.current = element;
            }
          } else {
            // older versions of React had the `ref` separate from props (still works in R19
            //  but results in a deprecation warning in Dev builds)
            if (typeof child.ref === "function") {
              child.ref(element);
            } else if (child.ref) {
              child.ref.current = element;
            }
          }
        }

        this.focusTrapElements = containerElements ? containerElements : [element];
      };

      const childWithRef = React.cloneElement(child, {
        ref: callbackRef,
      });

      return childWithRef;
    }

    return null;
  }
}

// NOTE: While React 19 REMOVED support for `propTypes`, support for `defaultProps`
//  __for class components ONLY__ remains: "Class components will continue to support
//  defaultProps since there is no ES6 alternative."
//  @see https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-proptypes-and-defaultprops
FocusTrap.defaultProps = {
  active: true,
  paused: false,
  focusTrapOptions: {},
  _createFocusTrap: createFocusTrap,
};
