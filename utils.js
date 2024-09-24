/**
 * Parses a markdown string into sections based on headers.
 *
 * @param {string} markdown - The markdown string to parse.
 * @returns {string[]} An array of sections, where each section is a string
 *                     containing the header and its corresponding content.
 */
export const parseMarkdown = (markdown) => {
  const lines = markdown.split("\n");
  const result = [];
  let currentSection = null;
  let currentContent = [];

  const addSection = () => {
    if (currentSection !== null) {
      result.push([currentSection, currentContent.join("\n")]);
      currentContent = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("#")) {
      addSection();
      currentSection = line;
    } else {
      currentContent.push(line);
    }
  }

  addSection(); // Add the last section

  return result.map((r) =>
    r
      .map((s) => s.trim())
      .join("\n\n")
      .trim()
  );
};
