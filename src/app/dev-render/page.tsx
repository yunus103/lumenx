import { notFound } from "next/navigation";
import { RenderTool } from "./RenderTool";

// Renders the home page's stills (public/renders) from the real viewer. Development only.
export default function DevRenderPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <RenderTool />;
}
