type CSFile = { content: string | Record<string, unknown> };
type CSDefinition = { files: Record<string, CSFile> };

function toUrlSafeBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function codeSandboxParameters(definition: CSDefinition): Promise<string> {
  const json = JSON.stringify(definition);
  const input = new TextEncoder().encode(json);

  if (!("CompressionStream" in window)) {
    throw new Error("CompressionStream is not available in this browser (need gzip fallback).");
  }

  const gzippedStream = new Response(input).body!.pipeThrough(new CompressionStream("gzip"));
  const gzippedBuf = await new Response(gzippedStream).arrayBuffer();
  return toUrlSafeBase64(new Uint8Array(gzippedBuf));
}

export async function openInCodeSandbox(definition: CSDefinition): Promise<void> {
  const parameters = await codeSandboxParameters(definition);
  const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
