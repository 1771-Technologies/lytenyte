export const PRECEDENCE: Readonly<Record<string, number | undefined>> = {
  "+": 50,
  "-": 50,
  "*": 60,
  "/": 60,
  "%": 60,
  "**": 70,
};
