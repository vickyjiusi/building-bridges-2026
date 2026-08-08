import Dashboard from "./Dashboard";
import { allSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return (
    <main className="portal">
      <header><a href="/">← 查看公开网站</a><span>教师审核后台</span></header>
      <section className="portal-title">
        <p>TEACHER CONTROL ROOM</p>
        <h1>内容审核台</h1>
        <span>开源演示版。正式部署时请按照 README 配置教师身份验证与云端存储。</span>
      </section>
      <Dashboard initial={await allSubmissions()} />
    </main>
  );
}
