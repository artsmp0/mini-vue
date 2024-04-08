export const enum NodeTypes {
  ELEMENT,
  TEXT,
  ATTRIBUTE,
}

export interface Position {
  offset: number; // from start of file
  line: number;
  column: number;
}

export interface SourceLocation {
  start: Position;
  end: Position;
  source: string;
}

export interface Node {
  type: NodeTypes;
  loc: SourceLocation;
}

export interface TextNode extends Node {
  type: NodeTypes.TEXT;
  content: string;
}

export interface AttributeNode extends Node {
  type: NodeTypes.ATTRIBUTE;
  name: string;
  value: TextNode | undefined;
}

export type TemplateChildNode = ElementNode | TextNode;

export interface ElementNode extends Node {
  type: NodeTypes.ELEMENT;
  tag: string;
  props: AttributeNode[];
  children: TemplateChildNode[];
  isSelfClosing: boolean;
}
