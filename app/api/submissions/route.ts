export async function POST() {
  return Response.json(
    { error: "云端数据库和图片存储尚未配置，请按照 README 完成迁移设置。" },
    { status: 503 },
  );
}
