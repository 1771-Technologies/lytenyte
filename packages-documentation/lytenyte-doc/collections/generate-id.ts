/*

Tutorial Routes

Start by defining a folder in brackets starting with the `@` symbol.
This will be considered a tutorial folder.

- (@tutorial)
  - index.mdx | the introduction to the tutorial
  - (01_setup)
    - index.mdx (the root step of the tutorial)
    - 01_fire.mdx (the first step)
    - 02.mdx (the second step)
  - (02_next)
    - index.mdx
    - 01.mdx
    - 02.mdx

/tutorial
/tutorial/setup
/tutorial/setup/fire
/tutorial/setup/2
 */

export function generateId({ entry }: { entry: string }) {
  if (entry.startsWith("./")) entry = entry.slice(2);
  else if (entry.startsWith("/")) entry = entry.slice(1);

  const cleaned = entry.split("/").map((x) => x.trim());

  let inTutorial = false;
  const idParts = [];
  for (let i = 0; i < cleaned.length; i++) {
    const entryPart = cleaned[i];

    const isLast = i === cleaned.length - 1;

    // Check if we are beginning a tutorial. If we are we will want to set the tutorial mode.
    // We can only enter tutorial mode once, so any subsequent occurrences should throw.
    if (entryPart.startsWith("(@")) {
      validateParensPart(entryPart, entry);

      // remove the parenthesis from the value
      const parentPart = entryPart.slice(2, -1);
      if (inTutorial) {
        throw new Error(
          `Encountered a nested tutorial. Does more than one part have an @ symbol? \n${entry}`,
        );
      }

      inTutorial = true;
      idParts.push(parentPart);
      continue;
    }

    if (inTutorial && entryPart.startsWith("(")) {
      validateParensPart(entryPart, entry);
      const previousEntry = cleaned[i - 1];

      if (!previousEntry || !previousEntry.startsWith("(@")) {
        throw new Error(`Tutorial mode does not support nested subfolders.`);
      }

      const parentPart = entryPart.slice(1, -1); // remove the parenthesis from the value
      const [numberLabel, ...rest] = parentPart.split("_");
      // there is more to this path.
      if (rest.length) {
        idParts.push(rest.join("_"));
      } else {
        const number = Number.parseInt(numberLabel);
        if (Number.isNaN(number)) {
          throw new Error(
            `The tutorial sections should begin with an integer value, e.g. 02. \n${entry}`,
          );
        }
        idParts.push(`${number}`);
      }
      continue;
    }

    if (entryPart.startsWith("(")) {
      validateParensPart(entryPart, entry);
      continue;
    }

    if (inTutorial && !isLast) throw new Error(`Tutorial mode does not support nested subfolders.`);

    if (inTutorial && isLast) {
      const previousEntry = cleaned[i - 1];
      const valueWithoutExtension = entryPart.split(".").slice(0, -1).join(".");
      if (valueWithoutExtension === "index") continue;

      if (!previousEntry || !previousEntry.startsWith("(") || previousEntry.startsWith("(@")) {
        throw new Error(`Tutorial steps should be nested in a folder with parenthesis. \n${entry}`);
      }

      const [numberLabel, ...rest] = valueWithoutExtension.split("_");
      const number = Number.parseInt(numberLabel);
      if (Number.isNaN(number)) {
        throw new Error(
          `Tutorial pages should either start with a number, or be called index. \n${entry}`,
        );
      }

      if (rest.length) {
        idParts.push(rest.join("_"));
      } else {
        idParts.push(`${number}`);
      }
      continue;
    }

    if (isLast) {
      const valueWithoutExtension = entryPart.split(".").slice(0, -1).join(".");
      if (valueWithoutExtension === "index") continue;

      idParts.push(valueWithoutExtension);
      continue;
    }

    idParts.push(entryPart);
  }

  return idParts.join("/");
}

function validateParensPart(part: string, full: string) {
  if (part.endsWith(")")) return;

  throw new Error(
    `Encountered an opening parenthesis without a corresponding closing parenthesis: \n${full}`,
  );
}

export interface TutorialSection {
  readonly path: string;
  readonly index: boolean;
  readonly steps: { path: string }[];
}

export interface Tutorial {
  readonly startPath: string;
  readonly sections: TutorialSection[];
}

/*

:::checklist

- [] Check
- [] Checked
- [] Alpha

:::


:::quiz

<QAndA>

<Q>
What is 1 + 1?
</Q>

<A>
The answer is 2
</A>

</QAndA>

:::

 */
