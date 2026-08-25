"use client";

import { useState } from "react";

type FutureMessage = {
  id: number;
  body: string;
  submitterName: string;
};

export default function FutureMessages({ messages }: { messages: FutureMessage[] }) {
  const [start, setStart] = useState(0);
  const [round, setRound] = useState(0);
  const visible = Array.from({ length: Math.min(3, messages.length) }, (_, index) =>
    messages[(start + index) % messages.length],
  );

  function refresh() {
    setStart((current) => (current + 3) % messages.length);
    setRound((current) => current + 1);
  }

  return <div className="future-message-panel">
    <div className="future-refresh-row">
      <span>{messages.length} 条公开留言</span>
      {messages.length > 3 && <button type="button" className="future-refresh" onClick={refresh}>换一组话语 ↻</button>}
    </div>
    <div className="future-cards" key={round} aria-live="polite">
      {visible.map((message) => <blockquote key={message.id}>“{message.body}”<b>— {message.submitterName}</b></blockquote>)}
      {!visible.length && <blockquote className="future-empty">未来的艺术，<br />可能是 ______。</blockquote>}
    </div>
  </div>;
}
