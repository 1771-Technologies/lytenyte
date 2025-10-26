# Play Frame

Playframe specification:

- Any file that ends wit `.play.tsx` is considered a play file.
- The file name is used as the name of the demo:
  - If the contains square brackets and content inside those brackets is used as the name
  - For example, `[My Name].play.tsx` will have a test name called `My Name`
  - If the file name does not have square brackets then the file name is used as the demo name.
- Square brackets create a frame grouping. Frame groupings allow files to be processed separately and
  also associated with a frame.

Example structure:

```txt
[Alpha]/
  [Run One].play.tsx
  [Run One]-beta.test.tsx
  [Run One]-live.test.tsx
  [Run Two].play.tsx
  doc.mdx
```

Then the resulting tree becomes:

```txt
Alpha
  - doc
  - Run one
      - beta
      - live
  - Run Two
```
