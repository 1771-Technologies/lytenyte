export interface Separator {
  readonly kind: "separator";
}

export interface PageLink {
  readonly kind: "page-link";
  readonly id: string;
  readonly path: string;
}

export interface DirectLink {
  readonly kind: "direct-link";
  readonly id: string;
  readonly label: string;
}

export interface ExternalLink {
  readonly kind: "external-link";
  readonly label: string;
  readonly href: string;
}

export interface Group {
  readonly kind: "group";
  readonly label?: string;
  readonly collapsed?: boolean;
  readonly collapsible?: boolean;
  readonly children: (PageLink | DirectLink | ExternalLink | Separator | Group | null)[];
}

export interface Root {
  readonly kind: "root";
  readonly path: string;
  readonly children: (PageLink | DirectLink | ExternalLink | Separator | Group | null)[];
  readonly collection: string;
}
