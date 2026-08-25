type StoryUpdate = {
  id: number;
  slotNumber: number | null;
  title: string;
  body: string;
  imageUrl?: string | null;
};

const baseDays = [
  { day: 0, date: "8月2日", title: "我们的初遇", image: "/story/day-00.webp" },
  { day: 1, date: "8月3日", title: "第一天上课", image: "/story/day-01.webp" },
  { day: 2, date: "8月4日", title: "灵感在课堂里发生", image: "/story/day-02.webp" },
  { day: 3, date: "8月5日", title: "虚位以待", image: null },
  { day: 4, date: "8月6日", title: "虚位以待", image: null },
  { day: 5, date: "8月7日", title: "秋天的第一杯奶茶", image: "/story/day-05.webp" },
  { day: 6, date: "8月8日", title: "告别班会", image: "/story/day-06.webp" },
  { day: 7, date: "8月9日", title: "闭营晚会", image: "/story/day-07.webp" },
];

export default function StoryMarquee({ updates }: { updates: StoryUpdate[] }) {
  const days = baseDays.map((day) => {
    const update = updates.find((item) => item.slotNumber === day.day && item.imageUrl);
    return update ? { ...day, title: update.title, image: update.imageUrl!, body: update.body } : day;
  });

  const group = (duplicate = false) => <div className="story-marquee-group" aria-hidden={duplicate || undefined}>
    {days.map((day) => <article className={`story-day-card ${day.image ? "has-photo" : "awaiting"}`} key={`${duplicate ? "copy" : "main"}-${day.day}`}>
      <div className="story-photo">
        {day.image ? <img src={day.image} alt={duplicate ? "" : `DAY ${String(day.day).padStart(2, "0")} ${day.title}`} /> : <div className="story-awaiting"><span>＋</span><b>虚位以待</b><small>这一天的照片还在路上</small></div>}
      </div>
      <footer><div><small>DAY {String(day.day).padStart(2, "0")}</small><span>2026 · {day.date}</span></div><h3>{day.title}</h3></footer>
    </article>)}
  </div>;

  return <div className="story-marquee" aria-label="2026年夏天七班影像日记">
    <div className="story-marquee-track">{group()}{group(true)}</div>
  </div>;
}
