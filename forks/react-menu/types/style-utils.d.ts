interface Base {
  name: string;
}

interface Directions {
  dirLeft: string;
  dirRight: string;
  dirTop: string;
  dirBottom: string;
}

export const menuSelector: Readonly<
  Base &
    Directions & {
      stateOpening: string;
      stateOpen: string;
      stateClosing: string;
      stateClosed: string;
      alignStart: string;
      alignCenter: string;
      alignEnd: string;
    }
>;

export const menuArrowSelector: Readonly<Base & Directions>;

export const menuItemSelector: Readonly<
  Base & {
    hover: string;
    disabled: string;
    anchor: string;
    checked: string;
    open: string;
    submenu: string;
    focusable: string;
    typeRadio: string;
    typeCheckbox: string;
  }
>;

export const menuDividerSelector: Readonly<Base>;
export const menuHeaderSelector: Readonly<Base>;
export const menuGroupSelector: Readonly<Base>;
export const radioGroupSelector: Readonly<Base>;
export const submenuSelector: Readonly<Base>;

export const menuContainerSelector: Readonly<
  Base & {
    itemTransition: string;
  }
>;

export const menuButtonSelector: Readonly<
  Base & {
    open: string;
  }
>;

export {};
