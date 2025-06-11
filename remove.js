const WORKER_URL = process.env.WORKER_URL || "http://localhost:8787";
const WORKER_API_KEY = process.env.WORKER_API_KEY || "xxx";

const NAMESPACE = process.argv[2]; // eg node remove.js bookeeping

if (!NAMESPACE) {
  console.error("Namespace is required");
  process.exit(1);
}

try {
  const response = await fetch(`${WORKER_URL}/api/vector/remove-by-namespace`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WORKER_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      namespace: NAMESPACE,
    }),
  });

  const responseJson = await response.json();

  if (response.ok) {
    console.log(`Successfully removed \`${NAMESPACE}\`:`, responseJson);
  } else {
    console.error(
      `Http error ${response.status} ${response.statusText}:`,
      responseJson
    );
  }
} catch (error) {
  console.error(`Error processing: ${error.message}`);
}
