import type { BinaryExpressionOperator, UnaryOperator } from "../lexer/types.js";

interface BaseNode {
  start: number;
  end: number;
}

export interface NumberLiteral extends BaseNode {
  type: "NumberLiteral";
  value: number;
}

export interface StringLiteral extends BaseNode {
  type: "StringLiteral";
  value: string;
}

export interface BooleanLiteral extends BaseNode {
  type: "BooleanLiteral";
  value: boolean;
}

export interface NullLiteral extends BaseNode {
  type: "NullLiteral";
  value: null;
}

export interface UndefinedLiteral extends BaseNode {
  type: "UndefinedLiteral";
  value: undefined;
}

export interface Identifier extends BaseNode {
  type: "Identifier";
  name: string;
}

export interface BinaryExpression extends BaseNode {
  type: "BinaryExpression";
  operator: BinaryExpressionOperator;
  left: ASTNode;
  right: ASTNode;
}

export interface UnaryExpression extends BaseNode {
  type: "UnaryExpression";
  operator: UnaryOperator;
  operand: ASTNode;
}

export interface ConditionalExpression extends BaseNode {
  type: "ConditionalExpression";
  test: ASTNode;
  consequent: ASTNode;
  alternate: ASTNode;
}

export interface MemberExpression extends BaseNode {
  type: "MemberExpression";
  object: ASTNode;
  property: ASTNode;
  computed: boolean;
}

export interface OptionalMemberExpression extends BaseNode {
  type: "OptionalMemberExpression";
  object: ASTNode;
  property: ASTNode;
  computed: boolean;
}

export interface ArrayLiteral extends BaseNode {
  type: "ArrayLiteral";
  readonly elements: readonly (ASTNode | SpreadElement)[];
}

export interface ObjectLiteral extends BaseNode {
  type: "ObjectLiteral";
  readonly properties: readonly ObjectProperty[];
}

export interface ObjectProperty extends BaseNode {
  type: "ObjectProperty";
  key: ASTNode;
  value: ASTNode;
  computed: boolean;
}

export interface CallExpression extends BaseNode {
  type: "CallExpression";
  callee: ASTNode;
  readonly args: readonly ASTNode[];
}

export interface PipeExpression extends BaseNode {
  type: "PipeExpression";
  input: ASTNode;
  transform: ASTNode;
}

export interface TemplateLiteral extends BaseNode {
  type: "TemplateLiteral";
  readonly parts: readonly (StringLiteral | ASTNode)[];
}

export interface SpreadElement extends BaseNode {
  type: "SpreadElement";
  argument: ASTNode;
}

export interface ArrowFunctionExpression extends BaseNode {
  type: "ArrowFunctionExpression";
  params: string[];
  body: ASTNode;
}

export interface DateLiteralNode extends BaseNode {
  type: "DateLiteralNode";
  value: string;
}

export type ASTNode =
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | NullLiteral
  | UndefinedLiteral
  | Identifier
  | BinaryExpression
  | UnaryExpression
  | ConditionalExpression
  | MemberExpression
  | OptionalMemberExpression
  | ArrayLiteral
  | ObjectLiteral
  | CallExpression
  | PipeExpression
  | TemplateLiteral
  | SpreadElement
  | ArrowFunctionExpression
  | DateLiteralNode;
