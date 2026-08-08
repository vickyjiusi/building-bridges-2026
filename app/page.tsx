import { approved } from "@/lib/submissions";

const groups = [
  {
    number: "01",
    title: "我们是谁",
    subtitle: "PEOPLE / IDENTITY",
    description: "用人物卡片介绍老师、同学和班级共同宣言，让访客先认识这个班级。",
    tasks: ["班级与老师介绍", "同学人物卡片", "一句共同宣言"],
    accent: "blue",
  },
  {
    number: "02",
    title: "课程与作品",
    subtitle: "ART / EXPERIMENTS",
    description: "收集课程中的AI图像、Glitch实验与网页设计草图，形成数字作品展。",
    tasks: ["AI创作精选", "Glitch视觉实验", "作品说明与署名"],
    accent: "acid",
  },
  {
    number: "03",
    title: "班级故事",
    subtitle: "STORIES / TIMELINE",
    description: "把课堂、活动与共同创作的过程整理成一条可以向下探索的时间线。",
    tasks: ["活动照片与图注", "七节课时间线", "一段班级故事"],
    accent: "sand",
  },
  {
    number: "04",
    title: "留言与未来",
    subtitle: "MESSAGES / FUTURE",
    description: "邀请每个人留下一句话：未来的艺术可能是什么？为展馆留下开放结尾。",
    tasks: ["未来艺术畅想", "留言板内容", "网站结束页面"],
    accent: "rose",
  },
];

const course = [
  ["01", "艺术与科技", "我们为什么要做一座数字展馆？"],
  ["02", "网页的感觉", "颜色、字体、留白与信息层级"],
  ["03", "游戏美术", "如何用视觉系统设计一个世界"],
  ["04", "AI与创作", "生成只是开始，选择决定表达"],
  ["05", "Glitch美学", "让数字媒介留下自己的痕迹"],
  ["06", "共同制作", "四个小组组装同一个网站"],
  ["07", "未来艺术", "展示、回顾与继续想象"],
];

export default async function Home() {
  const contributions = await approved();
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="回到首页">
          <span className="brand-mark">BB</span>
          <span>BUILDING BRIDGES 2026</span>
        </a>
        <nav aria-label="主导航">
          <a href="#about">关于我们</a>
          <a href="#studios">四组共创</a>
          <a href="#gallery">数字作品</a>
          <a href="#future">未来留言</a>
          <a href="/contribute">提交内容</a>
        </nav>
        <span className="header-index">00—07</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow">TECHNOLOGY × ART · CLASS DIGITAL PAVILION</p>
          <h1>
            WE BUILD
            <br />
            <span>BRIDGES</span>
          </h1>
          <p className="hero-intro">
            一座由全班共同完成的数字展馆。我们用网页连接同学、作品、故事，以及对未来艺术的想象。
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#studios">进入共创区域 <span>↘</span></a>
            <a className="text-link" href="#about">了解项目目标 →</a>
            <a className="text-link" href="/contribute">学生提交入口 →</a>
          </div>
        </div>

        <div className="bridge-scene" aria-hidden="true">
          <div className="signal signal-one">GROUP 01</div>
          <div className="signal signal-two">GROUP 04</div>
          <div className="bridge-arc arc-one" />
          <div className="bridge-arc arc-two" />
          <div className="bridge-deck" />
          <div className="bridge-node node-one" />
          <div className="bridge-node node-two" />
          <div className="bridge-node node-three" />
          <div className="bridge-node node-four" />
          <p className="scene-caption">ONE CLASS · FOUR STUDIOS · ONE SHARED WORLD</p>
        </div>
        <a className="scroll-cue" href="#about">向下探索 <span>↓</span></a>
      </section>

      <section className="manifesto section" id="about">
        <div className="section-label"><span>01</span> PROJECT MANIFESTO</div>
        <div className="manifesto-copy">
          <p className="large-statement">
            这不是四个彼此分开的网页，<br />而是四组学生共同建造的<span>一个世界</span>。
          </p>
          <div className="manifesto-notes">
            <p>所有板块共享同一套颜色、字体、按钮和动效规则。</p>
            <p>每个小组拥有自己的内容区域，但只有组合起来，展馆才完整。</p>
          </div>
        </div>
      </section>

      <section className="studios section" id="studios">
        <div className="section-heading">
          <div className="section-label"><span>02</span> FOUR STUDIOS</div>
          <h2>一个网站，四个制作部门</h2>
          <p>每组负责一个展区，并按照相同的交付格式提交内容。</p>
        </div>
        <div className="studio-grid">
          {groups.map((group) => (
            <article className={`studio-card ${group.accent}`} key={group.number}>
              <div className="studio-topline">
                <span>{group.number}</span>
                <span>{group.subtitle}</span>
              </div>
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <ul>
                {group.tasks.map((task) => <li key={task}>{task}</li>)}
              </ul>
              <a href={`#group-${group.number}`}>查看内容位置 <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="shared-rules section">
        <div className="section-label"><span>03</span> SHARED VISUAL RULES</div>
        <div className="rules-layout">
          <div>
            <h2>不同内容，遵守同一种视觉语言</h2>
            <p>这套规则由全班共同确认。各组可以表达自己的内容，但不能随意改变全站的基本性格。</p>
          </div>
          <div className="rules-list">
            <div><span>COLOR</span><strong>深黑绿 / 米白 / 橄榄绿</strong></div>
            <div><span>TYPE</span><strong>粗标题 / 清楚正文 / 少量编号</strong></div>
            <div><span>IMAGE</span><strong>统一比例 / 真实署名 / 简短图注</strong></div>
            <div><span>MOTION</span><strong>一个板块只使用一种主要动效</strong></div>
          </div>
        </div>
      </section>

      <section className="gallery section" id="gallery">
        <div className="section-heading horizontal">
          <div>
            <div className="section-label"><span>04</span> DIGITAL GALLERY</div>
            <h2>把每节课留下的东西放进来</h2>
          </div>
          <p>下方是可替换的作品位置。每组只需要准备标题、图片、作者和一句说明。</p>
        </div>
        <div className="gallery-grid">
          <article className="artwork artwork-wide" id="group-02">
            <div className="art-visual ai-art"><span>AI / HUMAN / CHOICE</span></div>
            <div className="art-meta"><span>AI视觉实验</span><span>替换为学生作品 01</span></div>
          </article>
          <article className="artwork">
            <div className="art-visual glitch-art"><span>ERR_2026</span></div>
            <div className="art-meta"><span>Glitch数字美学</span><span>替换为学生作品 02</span></div>
          </article>
          <article className="artwork">
            <div className="art-visual web-art"><span>WEB / SYSTEM</span></div>
            <div className="art-meta"><span>网页视觉草图</span><span>替换为学生作品 03</span></div>
          </article>
        </div>
      </section>

      <section className="community section" id="community">
        <div className="section-heading horizontal"><div><div className="section-label"><span>05</span> CLASS CONTRIBUTIONS</div><h2>经过审核的班级共创</h2></div><p>同学无需账号；提交的文字与图片由老师审核后统一进入展馆。</p></div>
        {contributions.length?<div className="community-grid">{contributions.map(x=><article className="community-card" key={x.id}>{x.imageKey&&<img src={`/api/media/${x.imageKey.split("/").pop()}`} alt={x.title}/>}<div><small>GROUP {x.groupNumber} · {x.contentType}</small><h3>{x.title}</h3><p>{x.body}</p><b>{x.submitterName}</b></div></article>)}</div>:<div className="community-empty"><h3>展区正在等待第一份内容</h3><p>老师审核通过后，学生作品会自动出现在这里。</p><a href="/contribute">提交第一份内容 →</a></div>}
      </section>

      <section className="people section" id="group-01">
        <div className="section-label"><span>05</span> PEOPLE ARCHIVE</div>
        <div className="people-heading">
          <h2>每个人，都是这座展馆中的一个坐标</h2>
          <p>鼠标经过人物卡片，查看这个位置未来需要补充的内容。</p>
        </div>
        <div className="people-grid">
          {["老师介绍", "同学卡片 01", "同学卡片 02", "同学卡片 03", "同学卡片 04", "同学卡片 05"].map((name, index) => (
            <article className="person-card" key={name}>
              <span className="person-number">0{index + 1}</span>
              <div className="portrait-placeholder"><span>+</span></div>
              <h3>{name}</h3>
              <p>照片 / 姓名 / 三个关键词 / 一句话介绍</p>
            </article>
          ))}
        </div>
      </section>

      <section className="timeline section" id="group-03">
        <div className="section-heading horizontal">
          <div>
            <div className="section-label"><span>06</span> OUR JOURNEY</div>
            <h2>七节课，逐步建成一座数字展馆</h2>
          </div>
          <p>第三组可以把真实课堂照片插入每个节点，让它成为班级共同创作的过程记录。</p>
        </div>
        <ol className="course-line">
          {course.map(([number, name, detail]) => (
            <li key={number}>
              <span className="course-number">{number}</span>
              <div><h3>{name}</h3><p>{detail}</p></div>
              <span className="course-dot" />
            </li>
          ))}
        </ol>
      </section>

      <section className="future section" id="future">
        <div className="future-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="future-content" id="group-04">
          <div className="section-label"><span>07</span> MESSAGE TO THE FUTURE</div>
          <h2>未来的艺术，<br />可能是<span>______</span>。</h2>
          <p>最后一组收集全班每个人的一句话，把答案做成可以滚动浏览的未来留言墙。</p>
          <div className="message-samples">
            <blockquote>“可能是一种可以进入、触碰和共同改变的空间。”</blockquote>
            <blockquote>“可能不再只有作者，也不再只有观众。”</blockquote>
            <blockquote className="empty-message">在这里加入下一句话 ＋</blockquote>
          </div>
        </div>
      </section>

      <footer>
        <div><strong>BUILDING BRIDGES 2026</strong><span>科技与艺术 · 班级数字展馆</span></div>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
