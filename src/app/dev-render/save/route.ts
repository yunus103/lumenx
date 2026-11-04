import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Stores a frame from the render tool in public/renders. Development only.
export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") return new Response(null, { status: 404 });
  const name = new URL(req.url).searchParams.get("name") ?? "";
  if (!/^(_test\/)?[\w-]+\.(webp|jpg)$/.test(name)) return new Response("bad name", { status: 400 });
  const file = path.join(process.cwd(), "public", "renders", name);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await req.arrayBuffer()));
  return Response.json({ file: name });
}
