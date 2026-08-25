"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Submission } from "@/lib/submissions";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function safeName(value: string) {
  return value.replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/^-+|-+$/g, "") || "image";
}

export default function Dashboard() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { data, error } = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ).auth.signInWithPassword({
      email: String(f.get("email")),
      password: String(f.get("password")),
    });
    if (error || !data.session) {
      setError("邮箱或密码不正确");
      return;
    }
    const t = data.session.access_token;
    const r = await fetch("/api/admin/submissions", {
      headers: { authorization: `Bearer ${t}` },
    });
    if (!r.ok) {
      setError("该账号没有教师权限");
      return;
    }
    setToken(t);
    setRows(await r.json());
  }

  async function action(x: Submission, status: string) {
    const r = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...x, status }),
    });
    if (r.ok) {
      setRows((a) =>
        a.map((v) => (v.id === x.id ? { ...x, status: status === "approved" ? "published" : status } : v)),
      );
    }
  }

  async function exportAll() {
    if (exporting) return;
    setExporting(true);
    setError("");
    setExportProgress("正在准备投稿信息…");
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const cleanRows = rows.map(({ imageUrl, ...row }) => row);
      zip.file("submissions.json", JSON.stringify(cleanRows, null, 2));

      const headers: Exclude<keyof Submission, "imageUrl">[] = [
        "id", "groupNumber", "contentType", "sectionKey", "slotNumber", "visibility",
        "submitterName", "title", "body", "imageKey", "status", "adminNote", "createdAt",
      ];
      const csv = [
        headers.map(csvCell).join(","),
        ...cleanRows.map((row) => headers.map((key) => csvCell(row[key])).join(",")),
      ].join("\r\n");
      zip.file("submissions.csv", `\uFEFF${csv}`);

      const images = rows.filter((row) => row.imageUrl);
      const failures: string[] = [];
      for (let i = 0; i < images.length; i += 1) {
        const row = images[i];
        setExportProgress(`正在下载图片 ${i + 1}/${images.length}…`);
        try {
          const response = await fetch(row.imageUrl!);
          if (!response.ok) throw new Error(String(response.status));
          const extension = row.imageKey?.split(".").pop()?.toLowerCase() || "jpg";
          const section = safeName(row.sectionKey || row.contentType);
          const name = `${String(row.id).padStart(3, "0")}-${safeName(row.submitterName)}.${extension}`;
          zip.file(`images/${section}/${name}`, await response.blob());
        } catch {
          failures.push(`${row.id}: ${row.imageKey ?? row.imageUrl}`);
        }
      }
      if (failures.length) zip.file("download-failures.txt", failures.join("\n"));

      setExportProgress("正在生成ZIP文件…");
      const archive = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(archive);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bb12-content-export-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setExportProgress(failures.length ? `导出完成，${failures.length}张图片下载失败，请查看ZIP内说明。` : "导出完成。");
    } catch {
      setError("导出失败，请刷新页面后重试；不要删除Supabase中的文件。");
      setExportProgress("");
    } finally {
      setExporting(false);
    }
  }

  if (!token) {
    return <form className="form-shell" onSubmit={login}><h2>教师登录</h2><label>邮箱<input name="email" type="email" required /></label><label>密码<input name="password" type="password" required /></label>{error && <p className="error">{error}</p>}<button className="submit">进入审核台 →</button></form>;
  }

  return <section className="dashboard">
    <article className="review export-panel">
      <div><h2>备份网站内容</h2><p>导出全部投稿信息和图片，Supabase中的原文件不会被删除。</p></div>
      <button className="approve" onClick={exportAll} disabled={exporting}>{exporting ? "正在导出…" : "导出全部内容和图片"}</button>
      {exportProgress && <p>{exportProgress}</p>}
      {error && <p className="error">{error}</p>}
    </article>
    {rows.map((x) => <article className="review" key={x.id}><div className="meta"><b>{x.status}</b><span>GROUP {x.groupNumber} · {x.contentType}</span></div><div className="review-main">{x.imageUrl && <img src={x.imageUrl} alt="提交预览" />}<div><h2>{x.title}</h2><p>{x.body}</p><b>{x.submitterName}</b></div></div><div className="actions"><button className="approve" onClick={() => action(x, "approved")}>审核通过并发布</button><button onClick={() => action(x, "rejected")}>退回</button></div></article>)}
  </section>;
}
