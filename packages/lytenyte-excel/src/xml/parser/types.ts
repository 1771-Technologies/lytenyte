export interface XmlElement {
  readonly tag: string;
  readonly ns?: string;
  readonly attrs: Record<string, string>;
  readonly children: XmlElement[];
  readonly text?: string;
}
