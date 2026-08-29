"use client";
import {FormEvent,useMemo,useState} from "react";
const sections=[
 ["student-profile","同学资料（01–24）"],["teacher-profile","老师资料（01–06）"],
 ["pbl-group-1","PBL 作品 · 一组"],["pbl-group-2","PBL 作品 · 二组"],["pbl-group-3","PBL 作品 · 三组"],["pbl-group-4","PBL 作品 · 四组"],["pbl-group-5","PBL 作品 · 五组"],
 ["class-story","班级故事 / 课堂照片"],["future-message","写给未来的话"]
];
export default function ContributionForm({initialSection=""}:{initialSection?:string}){
 const[state,setState]=useState("idle"),[message,setMessage]=useState(""),[section,setSection]=useState(initialSection),[visibility,setVisibility]=useState("public");
 const isStory=section==="class-story";
 const max=section==="student-profile"?24:section==="teacher-profile"?6:0;
 const slots=useMemo(()=>Array.from({length:max},(_,i)=>i+1),[max]);
 const storySlots=useMemo(()=>Array.from({length:8},(_,i)=>i),[]);
 const pblNumber=section.startsWith("pbl-group-")?section.slice(-1):"";
 async function compressImage(file:File){
  const targetBytes=600*1024;
  if(file.size<=targetBytes)return file;
  const bitmap=await createImageBitmap(file);
  try{
   const longest=Math.max(bitmap.width,bitmap.height);
   let scale=Math.min(1,1400/longest),quality=.78,best:Blob|null=null;
   for(let attempt=0;attempt<6;attempt++){
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(bitmap.width*scale));
    canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const context=canvas.getContext("2d");
    if(!context)throw new Error("浏览器无法处理图片");
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);
    const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",quality));
    if(!blob)throw new Error("图片压缩失败");
    best=blob;
    if(blob.size<=targetBytes)break;
    scale*=.82;
    quality=Math.max(.56,quality-.06);
   }
   if(!best||best.size>750*1024)throw new Error("图片压缩后仍然过大，请换一张图片");
   return new File([best],`${file.name.replace(/\.[^.]+$/,"")}.webp`,{type:"image/webp"});
  }finally{bitmap.close()}
 }
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setState("sending");setMessage("");const form=e.currentTarget,data=new FormData(form),image=data.get("image");
  if(image instanceof File&&image.size){
   if(image.size>15*1024*1024){setMessage("原始图片请不要超过15MB。");setState("error");return}
   try{data.set("image",await compressImage(image))}catch(error){setMessage(error instanceof Error?error.message:"图片压缩失败，请换一张图片");setState("error");return}
  }
  const r=await fetch("/api/submissions",{method:"POST",body:data}),d=await r.json().catch(()=>({}));if(r.ok){form.reset();setSection("");setState("done")}else{setMessage(r.status===413?"图片仍然过大，未能通过上传限制。请换一张图片后重试。":d.error??"提交失败，请重试。");setState("error")}
 }
 return <section className="form-shell">{state==="done"?<div className="success"><h2>✓ 已送到老师的审核箱</h2><p>老师审核后，内容会进入你选择的组别或页面位置。</p><button onClick={()=>setState("idle")}>继续提交</button></div>:<form onSubmit={submit}>
  <h2><span>01</span> 这份内容要放到哪里？</h2><label>目标展区<select required name="sectionKey" value={section} onChange={e=>setSection(e.target.value)}><option value="" disabled>请选择准确位置</option>{sections.map(([v,t])=><option value={v} key={v}>{t}</option>)}</select></label>
  {max>0&&<label>人物编号<select required name="slotNumber" defaultValue=""><option value="" disabled>请选择你的固定编号</option>{slots.map(n=><option key={n} value={n}>{String(n).padStart(2,"0")}</option>)}</select></label>}
  {isStory&&<label>影像日记位置<select required name="slotNumber" defaultValue=""><option value="" disabled>请选择 DAY 位置</option>{storySlots.map(n=><option key={n} value={n}>DAY {String(n).padStart(2,"0")}</option>)}</select></label>}
  <input type="hidden" name="groupNumber" value={pblNumber?`0${pblNumber}`:section==="student-profile"||section==="teacher-profile"?"01":section==="class-story"?"03":"04"}/><input type="hidden" name="contentType" value={sections.find(x=>x[0]===section)?.[1]||"班级内容"}/>
  <h2><span>02</span> 填写文字</h2><label>提交人 / 小组署名<input required maxLength={40} name="submitterName" placeholder="例如：一组 / 王同学"/></label><label>{max>0?"姓名或显示名称":isStory?"当天小标题":"项目标题"}<input required maxLength={80} name="title" placeholder={max>0?"将显示在人物卡片上":isStory?"例如：一起完成作品":"用一句话写出项目名称"}/></label><label>内容说明<textarea required maxLength={600} rows={6} name="body" placeholder="项目问题、过程、成果说明，或人物介绍、班级故事……"/></label>
  <h2><span>03</span> 上传图片</h2><label className="upload"><input type="file" name="image" accept="image/jpeg,image/png,image/webp"/><strong>JPG / PNG / WebP，上传前会自动压缩</strong></label>{section==="future-message"&&<label>可见范围<select name="visibility" value={visibility} onChange={e=>setVisibility(e.target.value)}><option value="public">审核后公开展示</option><option value="private">仅教师可见，不公开</option></select></label>}<input className="bot" name="website" tabIndex={-1}/><label className="agree"><input type="checkbox" name="consent" value="yes" required/>我确认文字和图片可以按上述可见范围用于本班课程网站。</label>{state==="error"&&<p className="error">{message}</p>}<button className="submit" disabled={state==="sending"}>{state==="sending"?"正在压缩并提交…":"提交给老师审核 →"}</button>
 </form>}</section>
}
