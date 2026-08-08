"use client";

import { useEffect, useRef, useState } from "react";

const MUSIC_URL = "/audio/clair-de-lune.mp3";

export default function PixelIntro() {
  const [phase, setPhase] = useState<"ready" | "jump" | "burst" | "welcome" | "exiting" | "gone">("ready");
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach(window.clearTimeout);
  }, []);

  const enterPage = () => {
    setPhase("exiting");
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.volume = .03;
      let volume = .03;
      const fade = window.setInterval(() => {
        volume = Math.min(.28, volume + .025);
        audio.volume = volume;
        if (volume >= .28) window.clearInterval(fade);
      }, 100);
    }
    timersRef.current.push(window.setTimeout(() => setPhase("gone"), 950));
  };

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = .001;
    setAudioError(false);
    void audio.play().then(() => setPlaying(true)).catch(() => { setPlaying(false); setAudioError(true); });
  };
  const start = () => { if (phase === "ready") { startMusic();setPhase("jump");timersRef.current=[window.setTimeout(()=>setPhase("burst"),480),window.setTimeout(()=>setPhase("welcome"),1080)]; } };
  const skip = () => { timersRef.current.forEach(window.clearTimeout);startMusic();setPhase("gone");window.setTimeout(()=>{if(audioRef.current)audioRef.current.volume=.28;},100); };
  const toggleMusic = () => { const a=audioRef.current;if(!a)return;if(a.paused){a.volume=.28;setAudioError(false);void a.play().then(()=>setPlaying(true)).catch(()=>setAudioError(true));}else{a.pause();setPlaying(false);} };

  return <>
    <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setAudioError(true)}}/>
    {phase!=="gone"&&<div className={`pixel-intro phase-${phase}`} onClick={start} onKeyDown={e => (e.key === " " || e.key === "Enter") && start()} role="button" tabIndex={0} aria-label="进入 BB12 班级空间">
      <button className="intro-skip" onClick={e => { e.stopPropagation(); skip(); }}>跳过 SKIP</button>
      <div className="pixel-sky"><span className="cloud c1"/><span className="cloud c2"/><span className="sun"/></div>
      <div className="intro-prompt">点击画面或按空格键开始</div>
      <div className="welcome-backdrop" aria-hidden="true" />
      <div className="intro-title"><small>BUILDING BRIDGES 2026</small><h1>WELCOME<br/>TO <b>BB12</b></h1><p>进入我们的班级共同世界</p><button className="intro-enter" onClick={e=>{e.stopPropagation();enterPage();}}>进入班级空间 <span>→</span></button></div>
      <div className="spark-seed" aria-hidden="true">✦</div>
      <div className="bb-block" aria-hidden="true"><span>BB<br/>12</span></div>
      <div className="pixel-student" aria-hidden="true"><i className="head"/><i className="body"/><i className="bag"/><i className="leg l1"/><i className="leg l2"/></div>
      <div className="pixel-ground" aria-hidden="true">{Array.from({length: 18},(_,i)=><i key={i}/>)}</div>
      <div className="intro-wipe" />
    </div>}
    <button className={`music-toggle ${audioError?"music-error":""}`} onClick={toggleMusic} aria-label={playing?"暂停背景音乐":"播放背景音乐"}><span>{playing?"Ⅱ":"▶"}</span><b>CLAIR DE LUNE</b><small>{audioError?"点击重试":playing?"MUSIC ON":"MUSIC OFF"}</small></button>
  </>;
}
