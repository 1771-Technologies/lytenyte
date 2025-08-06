export interface SeeAlsoLink {
  readonly kind: "link";
  readonly name: string;
  readonly link: string;
  readonly description: string;
}
export interface SeeAlsoType {
  readonly kind: "type";
  readonly name: string;
  readonly description: string;
}
export type SeeAlso = SeeAlsoType | SeeAlsoLink;

export interface PropertyType {
  readonly kind: "property";
  readonly name: string;
  readonly value: string;
  readonly optional: boolean;
  readonly tsDoc: string;
  readonly doc: {
    en: string | { [tag: string]: string };
    [lang: string]: string | { [tag: string]: string };
  };
  readonly seeAlso?: SeeAlso[];
}

export interface PreludeType {
  readonly kind: "prelude";
  readonly line: string;
  readonly tag?: string;
}

export interface UnionType {
  readonly kind: "union";
  readonly internal?: boolean;
  readonly name: string;
  readonly types: string[];
  readonly export: boolean;
  readonly tag?: string;
  readonly tsDoc: string;
  readonly seeAlso?: SeeAlso[];
  readonly doc: {
    en: string | { [tag: string]: string };
    [lang: string]: string | { [tag: string]: string };
  };
}

export interface InterfaceTypePartial {
  readonly kind: "interface-partial";
  readonly extends?: InterfaceTypePartial;
  readonly properties: PropertyType[];
}

export interface InterfaceType {
  readonly kind: "interface";
  readonly extends?: InterfaceTypePartial;
  readonly internal?: boolean;
  readonly seeAlso?: SeeAlso[];
  readonly export: boolean;
  readonly name: string;
  readonly properties: (
    | PropertyType
    | { kind: "withOverride"; prop: PropertyType; overrides?: Partial<PropertyType> }
  )[];
  readonly tag?: string;
  readonly tsDoc: string;
  readonly doc: {
    en: string | { [tag: string]: string };
    [lang: string]: string | { [tag: string]: string };
  };
}

export interface FunctionType {
  readonly kind: "function";
  readonly export: boolean;
  readonly name: string;
  readonly seeAlso?: SeeAlso[];
  readonly properties: (
    | PropertyType
    | { kind: "withOverride"; prop: PropertyType; overrides?: Partial<PropertyType> }
  )[];
  readonly return: string;
  readonly tag?: string;
  readonly tsDoc: string;
  readonly doc: {
    en: string | { [tag: string]: string };
    [lang: string]: string | { [tag: string]: string };
  };
}

export type GenTypes = UnionType | InterfaceType | FunctionType | PreludeType;
