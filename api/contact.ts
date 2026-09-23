import { handleContact } from "../server/contact.js";

type NodeRequest = {
  method?: string;
  body?: unknown;
  on?: (event: string, listener: (chunk?: Uint8Array | string) => void) => void;
};

type NodeResponse = {
  status: (code: number) => NodeResponse;
  setHeader: (name: string, value: string) => void;
  end: (body: string) => void;
};

async function readBody(req: NodeRequest) {
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body);
  if (typeof req.body === "string") return req.body;
  if (!req.on) return "";
  const chunks: Uint8Array[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on!("data", (chunk) => {
      if (!chunk) return;
      chunks.push(typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk);
    });
    req.on!("end", () => resolve());
    req.on!("error", reject);
  });
  const total = chunks.reduce((size, chunk) => size + chunk.length, 0);
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(merged);
}

export default async function handler(req: NodeRequest, res: NodeResponse) {
  const response = await handleContact(
    new Request("https://focuschat.co/api/contact", {
      method: req.method || "POST",
      headers: { "content-type": "application/json" },
      body: req.method === "GET" ? undefined : await readBody(req),
    }),
  );
  res.status(response.status);
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(await response.text());
}
