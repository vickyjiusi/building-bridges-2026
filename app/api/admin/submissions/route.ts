export async function PATCH() {
  return Response.json({ error: "云端后台尚未配置。" }, { status: 503 });
}

export async function DELETE() {
  return Response.json({ error: "云端后台尚未配置。" }, { status: 503 });
}
