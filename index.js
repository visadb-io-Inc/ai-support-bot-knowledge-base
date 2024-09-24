import fs from "fs";
import { parseMarkdown } from "./utils.js";

const WORKER_URL = "https://ai-support-bot.visadb.workers.dev";
const WORKER_API_KEY = "12owieurytheu2io93e8r7y6e372u8owuehdgh";

function getContents() {
  let contents = [];

  const namespaces = fs.readdirSync(`./content`);

  for (const namespace of namespaces) {
    const files = fs.readdirSync(`./content/${namespace}`);
    for (const file of files) {
      if (!file.endsWith(".md")) {
        continue;
      }

      const content = fs.readFileSync(
        `./content/${namespace}/${file}`,
        "utf-8"
      );

      const fileName = file.replace(".md", "");

      contents.push({
        namespace,
        fileName,
        fileSource: `${namespace}/${file}`,
        content: parseMarkdown(content),
      });
    }
  }

  return contents;
}

const contents = getContents();

for (const content of contents) {
  try {
    const response = await fetch(`${WORKER_URL}/api/vector/upsert`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WORKER_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        text: content.content,
        source: content.fileSource,
        namespace: content.namespace,
      }),
    });

    const responseJson = await response.json();

    if (response.ok) {
      console.log(
        `Successfully processed \`${content.fileSource}\`:`,
        responseJson
      );
    } else {
      console.error(
        `Http error ${response.status} ${response.statusText}:`,
        responseJson
      );
    }
  } catch (error) {
    console.error(`Error processing ${content.fileSource}: ${error.message}`);
  }
}
