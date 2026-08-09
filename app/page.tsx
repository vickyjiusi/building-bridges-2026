import PixelIntro from "./PixelIntro";
import { approved } from "@/lib/submissions";

// Published submissions must be read on every request so teacher approvals
// appear immediately without rebuilding the whole site.
export const dynamic = "force-dynamic";

const pblGroups = [
  ["pbl-group-1","一组","PBL GROUP 01","yellow"],
  ["pbl-group-2","二组","PBL GROUP 02","blue"],
  ["pbl-group-3","三组","PBL GROUP 03","green"],
  ["pbl-group-4","四组","PBL GROUP 04","coral"],
  ["pbl-group-5","五组","PBL GROUP 05","pink"],
];

export default async function Home(){
  const rows = await approved();
  const publicRows = rows.filter(r => r.visibility !== "private");
  const students = publicRows.filter(r=>r.sectionKey==="student-profile");
  const teachers = publicRows.filter(r=>r.sectionKey==="teacher-profile");
  const slot = (items: typeof rows,n:number,label:string) => { const item=items.find(x=>x.slotNumber===n); return <article className={`person-tile ${item?"filled":""}`} key={n}>{item?.imageUrl?<img src={item.imageUrl} alt={item.title}/>:<div className="avatar-placeholder">{String(n).padStart(2,"0")}</div>}<div><small>{label} {String(n).padStart(2,"0")}</small><h3>{item?.title||"等待加入"}</h3><p>{item?.body||"姓名 · 关键词 · 一句话"}</p></div></article>};
  return <main><PixelIntro/>
    <header className="fresh-header"><a href="#home" className="fresh-brand"><b>BB12</b><span>CLASS DIGITAL SPACE</span></a><nav><a href="#people">我们</a><a href="#works">PBL 作品</a><a href="#stories">故事</a><a href="#future">未来</a></nav><a className="upload-pill" href="/contribute">＋ 上传内容</a></header>
    <section className="fresh-hero" id="home"><div className="hero-stamp">CLASS 12 · 2026</div><div><p className="kicker">TECHNOLOGY × ART × ALL OF US</p><h1>WE GROW<br/><em>TOGETHER.</em></h1><p>这里有 24 名同学、6 名老师，以及一座正在共同生长的班级空间。每一份作品、故事和想法，都有自己的位置。</p><div className="hero-buttons"><a href="#people">进入班级空间 ↓</a><a href="/contribute">把内容放进来 ↗</a></div></div><div className="garden-art" aria-hidden="true"><span className="hill h1"/><span className="hill h2"/><span className="flower f1">✦</span><span className="flower f2">✦</span><span className="flower f3">✦</span><b>30<br/><small>PEOPLE</small></b></div></section>
    <section className="intro-strip"><span>24 STUDENTS</span><span>06 TEACHERS</span><span>05 PBL GROUPS</span><span>01 SHARED WORLD</span></section>

    <section className="fresh-section people-section" id="people"><header className="section-head"><div><small>01 / PEOPLE</small><h2>我们是谁</h2></div><p>每个人都有一个固定位置。提交人物资料时选择自己的编号，老师审核后会精准进入这里。</p></header><div className="people-subhead"><h3>同学 STUDENTS</h3><span>24 个位置</span></div><div className="people-grid-fresh">{Array.from({length:24},(_,i)=>slot(students,i+1,"STUDENT"))}</div><div className="people-subhead teachers"><h3>老师 TEACHERS</h3><span>6 个位置</span></div><div className="people-grid-fresh teacher-grid">{Array.from({length:6},(_,i)=>slot(teachers,i+1,"TEACHER"))}</div></section>

    <section className="fresh-section works-section" id="works"><header className="section-head pbl-head"><div><small>02 / PBL PROJECTS</small><h2>我们的 PBL 作品</h2></div><p><b>PBL 教学法（Problem-Based Learning / Project-Based Learning）</b>是以问题或项目为导向的教学模式。该方法以学生为中心，通过小组合作形式围绕真实世界的非结构化问题展开，培养学生批判性思维、解决问题及团队协作能力，教师角色转为指导者。</p></header><div className="category-grid pbl-grid">{pblGroups.map(([key,title,label,color],index)=>{const works=publicRows.filter(r=>r.sectionKey===key);return <article className={`category pbl-card ${color}`} key={key}><div className="cat-index">{String(index+1).padStart(2,"0")}</div><small>{label}</small><h3>{title}</h3>{works.length?<div className="mini-works">{works.slice(0,4).map(w=><div key={w.id}>{w.imageUrl&&<img src={w.imageUrl} alt={w.title}/>}<b>{w.title}</b><span>{w.submitterName}</span></div>)}</div>:<div className="empty-slot"><b>这一组的项目空间</b><span>可上传项目图片、过程记录与成果说明</span></div>}<a href={`/contribute?section=${key}`}>＋ 上传{title}的 PBL 内容</a></article>})}</div></section>

    <section className="fresh-section story-section" id="stories"><header className="section-head"><div><small>03 / STORIES</small><h2>正在发生的故事</h2></div><p>课堂照片、活动片段和共同制作过程，会在这里成为班级时间线。</p></header><div className="story-ribbon">{["认识科技艺术","设计网页世界","从游戏学习视觉","和 AI 讨论创作","拥抱数字故障","共同完成网站","想象未来艺术"].map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3><p>CLASS IN PROGRESS</p></article>)}</div><a className="section-upload" href="/contribute?section=class-story">＋ 添加一段班级故事</a></section>

    <section className="fresh-section future-section" id="future"><div><small>04 / MESSAGE TO FUTURE</small><h2>写给未来，<br/>也写给现在的我们。</h2><p>你可以选择公开展示，也可以作为私密信件只交给老师保存。没有学生账号时，网站不会声称只有本人可以读取。</p><a href="/contribute?section=future-message">写下一句话 →</a></div><div className="future-cards">{publicRows.filter(r=>r.sectionKey==="future-message").slice(0,3).map(x=><blockquote key={x.id}>“{x.body}”<b>— {x.submitterName}</b></blockquote>)}<blockquote className="future-empty">未来的艺术，<br/>可能是 ______。</blockquote></div></section>
    <footer className="fresh-footer"><div><b>BB12</b><span>BUILDING BRIDGES 2026</span></div><p>一座由全班共同建造、持续生长的数字空间。</p><a href="#home">BACK TO TOP ↑</a></footer>
  </main>;
}
