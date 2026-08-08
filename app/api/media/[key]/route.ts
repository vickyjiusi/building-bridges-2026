import { adminClient } from "@/lib/submissions";
export async function GET(_: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const db = adminClient();
  const { data } = await db.from("submissions").select("image_path,status")
    .like("image_path", `%/${key}`).eq("status", "published").maybeSingle();
  if (!data?.image_path) return new Response("Not found", { status: 404 });
  const { data: signed } = await db.storage.from("submission-images").createSignedUrl(data.image_path, 600);
  return signed?.signedUrl ? Response.redirect(signed.signedUrl, 307) : new Response("Not found", { status: 404 });
}
