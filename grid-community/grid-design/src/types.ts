export type Theme = {
  readonly headerFontSize: string;
  readonly headerFontWeight: string;
  readonly headerFontSizeAlt: string;
  readonly headerFontWeightAlt: string;
  readonly headerFontTypeface: string;

  readonly headerBg: string;
  readonly headerFg: string;
  readonly headerFgAlt: string;
  readonly headerPx: string;
  readonly headerPy: string;
  readonly headerYDivider: string;
  readonly headerXDivider: string;

  readonly colors: {
    readonly gradient_shadow: string;
    readonly primary_05: string;
    readonly primary_10: string;
    readonly primary_30: string;
    readonly primary_50: string;
    readonly primary_70: string;
    readonly primary_90: string;
    readonly gray_00: string;
    readonly gray_02: string;
    readonly gray_05: string;
    readonly gray_10: string;
    readonly gray_20: string;
    readonly gray_30: string;
    readonly gray_40: string;
    readonly gray_50: string;
    readonly gray_60: string;
    readonly gray_70: string;
    readonly gray_80: string;
    readonly gray_90: string;
    readonly gray_100: string;
    readonly backgrounds_default: string;
    readonly backgrounds_strong: string;
    readonly backgrounds_light: string;
    readonly backgrounds_button_light: string;
    readonly backgrounds_context_menu: string;
    readonly backgrounds_floating_panel: string;
    readonly backgrounds_form_field: string;
    readonly backgrounds_form_field_focus: string;
    readonly backgrounds_page: string;
    readonly backgrounds_row_alternate: string;
    readonly backgrounds_row: string;
    readonly backgrounds_row_hover: string;
    readonly backgrounds_ui_panel: string;
    readonly backgrounds_row_selected: string;
    readonly borders_row: string;
    readonly borders_pin_separator: string;
    readonly borders_default: string;
    readonly borders_strong: string;
    readonly borders_button_light: string;
    readonly borders_context_menu: string;
    readonly borders_field_and_button: string;
    readonly borders_field_and_button_shadow: string;
    readonly borders_icons_default: string;
    readonly borders_ui_panel: string;
    readonly borders_floating_panel: string;
    readonly borders_separator: string;
    readonly borders_focus_shadow: string;
    readonly borders_focus: string;
    readonly system_plain_pill_fill: string;
    readonly system_column_pill_fill: string;
    readonly system_column_pill_stroke: string;
    readonly system_pivot_pill_fill: string;
    readonly system_pivot_pill_stroke: string;
    readonly system_group_pill_fill: string;
    readonly system_group_pill_stroke: string;
    readonly system_pill_icon_color: string;
    readonly system_green_10: string;
    readonly system_green_30: string;
    readonly system_green_50: string;
    readonly system_green_70: string;
    readonly system_green_90: string;
    readonly system_info_10: string;
    readonly system_info_30: string;
    readonly system_info_50: string;
    readonly system_info_70: string;
    readonly system_info_90: string;
    readonly system_red_10: string;
    readonly system_red_30: string;
    readonly system_red_50: string;
    readonly system_red_70: string;
    readonly system_red_90: string;
    readonly system_yellow_10: string;
    readonly system_yellow_30: string;
    readonly system_yellow_50: string;
    readonly system_yellow_70: string;
    readonly system_yellow_90: string;
    readonly text_hyperlink: string;
    readonly text_primary_button: string;
    readonly text_dark: string;
    readonly text_light: string;
    readonly text_medium: string;
    readonly text_x_light: string;
  };

  readonly transitions: {
    /** cubic-bezier(0.4, 0, 0.2, 1) */
    readonly fn: string;
    /** 200ms */
    readonly slow: string;
    /** 150ms */
    readonly normal: string;
    /** 100ms */
    readonly fast: string;
    /** 50ms */
    readonly vfast: string;
  };

  readonly shadows: {
    /** 0px 1px 2.5px 0px rgba(30, 30, 41, 0.13), 0px 0px 0px 1px rgba(30, 30, 41, 0.02) */
    readonly 100: string;
    /** 0px 1px 1px 0px rgba(30, 30, 41, 0.06), 0px 1px 0px 1px rgba(51, 51, 51, 0.05), 0px 2px 3px 0.625px rgba(30, 30, 41, 0.1) */
    readonly 200: string;
    /** 0px 11px 10px -6px rgba(30, 30, 41, 0.06), 0px 1px 7px 0px rgba(30, 30, 41, 0.12) */
    readonly 300: string;
    /** 0px 14px 18px -6px rgba(30, 30, 41, 0.07), 0px 3px 13px 0px rgba(30, 30, 41, 0.1) */
    readonly 400: string;
    /** 0px 3px 20px 0px rgba(30, 30, 41, 0.1), 0px 19px 24.75px -9px rgba(30, 30, 41, 0.11) */
    readonly 500: string;
    /** 0px 6px 36px 0px rgba(30, 30, 41, 0.12), 0px 37px 35.75px -20px rgba(30, 30, 41, 0.07) */
    readonly 600: string;
    /** 0px 16px 22px -10px rgba(30, 30, 41, 0.06), 0px 22px 64px 0px rgba(30, 30, 41, 0.16) */
    readonly 700: string;

    /** 0px 1px 2.5px 0px rgba(0, 0, 0, 0.53) */
    readonly dark_100: string;
    /** 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 2px 3px 0.625px rgba(0, 0, 0, 0.27) */
    readonly dark_200: string;
    /** 0px 11px 10px -6px rgba(0, 0, 0, 0.2), 0px 1px 7px 0px rgba(0, 0, 0, 0.6) */
    readonly dark_300: string;
    /** 0px 14px 18px -6px rgba(0, 0, 0, 0.25), 0px 3px 13px 0px rgba(0, 0, 0, 0.35) */
    readonly dark_400: string;
    /** 0px 3px 20px 0px rgba(0, 0, 0, 0.28), 0px 19px 24.75px -9px rgba(0, 0, 0, 0.35) */
    readonly dark_500: string;
    /** 0px 6px 36px 0px rgba(0, 0, 0, 0.28), 0px 37px 35.75px -20px rgba(0, 0, 0, 0.35) */
    readonly dark_600: string;
    /** 0px 16px 22px -10px rgba(0, 0, 0, 0.28), 0px 22px 64px 0px rgba(0, 0, 0, 0.35) */
    readonly dark_700: string;
  };

  readonly spacing: {
    /** 2px */
    readonly space_02: string;
    /** 4px */
    readonly space_05: string;
    /** 6px */
    readonly space_10: string;
    /** 8px */
    readonly space_20: string;
    /** 10px */
    readonly space_25: string;
    /** 12px */
    readonly space_30: string;
    /** 16px */
    readonly space_40: string;
    /** 20px */
    readonly space_50: string;
    /** 24px */
    readonly space_60: string;
    /** 28px */
    readonly space_65: string;
    /** 32px */
    readonly space_70: string;
    /** 48px */
    readonly space_80: string;
    /** 64px */
    readonly space_90: string;
    /** 128px */
    readonly space_100: string;

    /** 6px */
    readonly box_radius_regular: string;
    /** 8px */
    readonly box_radius_medium: string;
    /** 12px */
    readonly box_radius_large: string;

    /** 24px */
    readonly input_height: string;

    /** 10px */
    readonly field_radius_large: string;
    /** 8px */
    readonly field_radius_medium: string;
    /** 6px */
    readonly field_radius_small: string;

    /** 4px */
    readonly field_padding_small: string;
    /** 6px */
    readonly field_padding_medium: string;
    /** 8px */
    readonly field_padding_large: string;
    /** 12px */
    readonly field_padding_xlarge: string;

    /** 4px */
    readonly thead_vertical_padding: string;
    /** 8px */
    readonly cell_vertical_padding: string;
    /** 10px */
    readonly cell_horizontal_padding: string;
  };

  readonly typography: {
    /** "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" */
    readonly typeface_headline: string;
    /** "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" */
    readonly typeface_body: string;

    /** 3rem */
    readonly h1: string;
    /** 2rem */
    readonly h2: string;
    /** 1.5rem */
    readonly h3: string;
    /** 1.25rem */
    readonly h4: string;
    /** 1.125rem */
    readonly h5: string;
    /** 1rem */
    readonly h6: string;

    /** 1rem */
    readonly body_l: string;
    /** 0.875rem */
    readonly body_m: string;
    /** 0.75rem */
    readonly body_s: string;
    /** 0.688rem */
    readonly body_xs: string;
  };
};
