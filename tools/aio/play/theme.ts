/**
 * Theme configuration object containing colors and spacing values
 */
export type Theme = {
  colors: {
    bg: string;
    bgSideBar: string;
    bgHeader: string;
    bgFrame: string;
  };

  space: SpaceScale;
};

export type SpaceScale = {
  /** 1px */
  _px: string;
  /** 0 */
  _00: string;
  /** 2px */
  _00_5: string;
  /** 4px */
  _01: string;
  /** 6px */
  _01_5: string;
  /** 8px */
  _02: string;
  /** 10px */
  _02_5: string;
  /** 12px */
  _03: string;
  /** 14px */
  _03_5: string;
  /** 16px */
  _04: string;
  /** 20px */
  _05: string;
  /** 24px */
  _06: string;
  /** 28px */
  _07: string;
  /** 32px */
  _08: string;
  /** 36px */
  _09: string;
  /** 40px */
  _10: string;
  /** 44px */
  _11: string;
  /** 48px */
  _12: string;
  /** 56px */
  _14: string;
  /** 64px */
  _16: string;
  /** 80px */
  _20: string;
  /** 96px */
  _24: string;
  /** 112px */
  _28: string;
  /** 128px */
  _32: string;
  /** 144px */
  _36: string;
  /** 160px */
  _40: string;
  /** 176px */
  _44: string;
  /** 192px */
  _48: string;
  /** 208px */
  _52: string;
  /** 224px */
  _56: string;
  /** 240px */
  _60: string;
  /** 256px */
  _64: string;
  /** 288px */
  _72: string;
  /** 320px */
  _80: string;
  /** 384px */
  _96: string;
};

export const t: Theme = {
  colors: {
    bg: "var(--play-bg-color)",
    bgSideBar: "var(--play-bg-sidebar)",
    bgFrame: "var(--play-bg-frame)",
    bgHeader: "var(--play-bg-header)",
  },

  space: {
    _px: "1px",
    _00: "0",
    _00_5: "2px",
    _01: "4px",
    _01_5: "6px",
    _02: "8px",
    _02_5: "10px",
    _03: "12px",
    _03_5: "14px",
    _04: "16px",
    _05: "20px",
    _06: "24px",
    _07: "28px",
    _08: "32px",
    _09: "36px",
    _10: "40px",
    _11: "44px",
    _12: "48px",
    _14: "56px",
    _16: "64px",
    _20: "80px",
    _24: "96px",
    _28: "112px",
    _32: "128px",
    _36: "144px",
    _40: "160px",
    _44: "176px",
    _48: "192px",
    _52: "208px",
    _56: "224px",
    _60: "240px",
    _64: "256px",
    _72: "288px",
    _80: "320px",
    _96: "384px",
  },
};
