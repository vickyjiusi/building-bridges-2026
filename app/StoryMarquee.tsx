"use client";

import { useEffect, useRef } from "react";

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
  { day: 3, date: "8月5日", title: "BB12 每日热搜榜", image: "/story/day-03.webp?v=20260829-1" },
  { day: 4, date: "8月6日", title: "BB12 每日热搜榜", image: "/story/day-04.webp?v=20260829-1" },
  { day: 5, date: "8月7日", title: "秋天的第一杯奶茶", image: "/story/day-05.webp" },
  { day: 6, date: "8月8日", title: "告别班会", image: "/story/day-06.webp" },
  { day: 7, date: "8月9日", title: "闭营晚会", image: "/story/day-07.webp" },
];

export default function StoryMarquee({ updates }: { updates: StoryUpdate[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  const days = baseDays.map((day) => {
    const update = updates.find((item) => item.slotNumber === day.day && item.imageUrl);
    return update ? { ...day, title: update.title, image: update.imageUrl!, body: update.body } : day;
  });

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const wrapScroll = () => {
      const scroller = scrollerRef.current;
      const group = firstGroupRef.current;
      if (!scroller || !group) return;
      const width = group.offsetWidth;
      if (width <= 0) return;
      if (scroller.scrollLeft >= width) scroller.scrollLeft -= width;
      if (scroller.scrollLeft <= 0 && draggingRef.current) scroller.scrollLeft += width;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 40);
      previous = now;
      const scroller = scrollerRef.current;
      if (scroller && !pausedRef.current && !draggingRef.current && !reducedMotion.matches) {
        scroller.scrollLeft += elapsed * 0.04;
        wrapScroll();
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const normalizeScroll = () => {
    const scroller = scrollerRef.current;
    const group = firstGroupRef.current;
    if (!scroller || !group) return;
    const width = group.offsetWidth;
    if (scroller.scrollLeft >= width) scroller.scrollLeft -= width;
    if (scroller.scrollLeft <= 0) scroller.scrollLeft += width;
  };

  const group = (duplicate = false) => <div ref={duplicate ? undefined : firstGroupRef} className="story-marquee-group" aria-hidden={duplicate || undefined}>
    {days.map((day) => <article className={`story-day-card ${day.image ? "has-photo" : "awaiting"}`} key={`${duplicate ? "copy" : "main"}-${day.day}`}>
      <div className="story-photo">
        {day.image ? <img src={day.image} alt={duplicate ? "" : `DAY ${String(day.day).padStart(2, "0")} ${day.title}`} /> : <div className="story-awaiting"><span>＋</span><b>虚位以待</b><small>这一天的照片还在路上</small></div>}
      </div>
      <footer><div><small>DAY {String(day.day).padStart(2, "0")}</small><span>2026 · {day.date}</span></div><h3>{day.title}</h3></footer>
    </article>)}
  </div>;

  return <div
    ref={scrollerRef}
    className="story-marquee"
    aria-label="2026年夏天BB12影像日记"
    onPointerEnter={() => { pausedRef.current = true; }}
    onPointerLeave={() => { if (!draggingRef.current) pausedRef.current = false; }}
    onPointerDown={(event) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      draggingRef.current = true;
      pausedRef.current = true;
      dragStartXRef.current = event.clientX;
      dragStartScrollRef.current = scroller.scrollLeft;
      scroller.classList.add("is-dragging");
      scroller.setPointerCapture(event.pointerId);
    }}
    onPointerMove={(event) => {
      const scroller = scrollerRef.current;
      if (!scroller || !draggingRef.current) return;
      scroller.scrollLeft = dragStartScrollRef.current - (event.clientX - dragStartXRef.current);
      normalizeScroll();
    }}
    onPointerUp={(event) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      draggingRef.current = false;
      scroller.classList.remove("is-dragging");
      if (scroller.hasPointerCapture(event.pointerId)) scroller.releasePointerCapture(event.pointerId);
      pausedRef.current = scroller.matches(":hover");
    }}
    onPointerCancel={() => {
      draggingRef.current = false;
      pausedRef.current = false;
      scrollerRef.current?.classList.remove("is-dragging");
    }}
    onWheel={(event) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      event.preventDefault();
      const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      scroller.scrollLeft += movement;
      normalizeScroll();
    }}
  >
    <div className="story-marquee-track">{group()}{group(true)}</div>
  </div>;
}
