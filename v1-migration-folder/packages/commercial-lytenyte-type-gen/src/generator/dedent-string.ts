export function dedentString(input: string, spacesPerTab: number = 2): string {
  // Step 1: Replace tabs with spaces
  const spaces = " ".repeat(spacesPerTab);
  const convertedInput = input.replace(/\t/g, spaces);

  // Step 2: Split the string by new lines
  const lines = convertedInput.split("\n");

  // Step 3: Determine the number of leading spaces in the first line
  const firstNonEmptyLineIndex = lines.findIndex((line) => line.trim() !== "");

  if (firstNonEmptyLineIndex === -1) {
    // If all lines are empty, return the original string
    return convertedInput;
  }

  const firstNonEmptyLine = lines[firstNonEmptyLineIndex];
  const leadingSpacesCount = firstNonEmptyLine.match(/^ */)?.[0].length || 0;

  // Step 4: If the first line has 0 leading spaces and the second line also has 0, return the original string
  if (
    leadingSpacesCount === 0 &&
    lines[firstNonEmptyLineIndex + 1]?.match(/^ */)?.[0].length === 0
  ) {
    return convertedInput;
  }

  // Step 5: Dedent all lines by the number of leading spaces counted
  const dedentedLines = lines.map((line) => {
    if (line.trim() === "") return line; // Preserve empty lines
    return line.startsWith(" ".repeat(leadingSpacesCount))
      ? line.slice(leadingSpacesCount) // Remove leading spaces
      : line; // If the line has fewer spaces, keep it unchanged
  });

  // Step 6: Join the lines back into a single string
  return dedentedLines.join("\n");
}
