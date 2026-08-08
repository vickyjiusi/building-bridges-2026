import Link from "next/link";import ContributionForm from "./ContributionForm";
export default function Page(){return <main className="portal"><header><Link href="/">← 返回展馆</Link><span>STUDENT CONTRIBUTION</span></header><section className="portal-title"><p>NO ACCOUNT REQUIRED</p><h1>把你们组的想法<br/>送进同一个网站</h1><span>填写文字并上传图片。提交后先由老师审核，不会立即公开。</span></section><ContributionForm/></main>}
