import { createClient } from "@supabase/supabase-js";
import localPublished from "@/data/published-content.json";
export type Submission={id:number;groupNumber:string;contentType:string;sectionKey:string;slotNumber:number|null;visibility:string;submitterName:string;title:string;body:string;imageKey:string|null;imageUrl?:string|null;status:string;adminNote:string;createdAt:string};
export function adminClient(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!key)throw new Error("Missing Supabase settings");return createClient(url,key,{auth:{persistSession:false}})}
function mapRow(r:any):Submission{return{id:r.id,groupNumber:r.group_number,contentType:r.content_type,sectionKey:r.section_key??"class-story",slotNumber:r.slot_number??null,visibility:r.visibility??"public",submitterName:r.submitter_name,title:r.title,body:r.body,imageKey:r.image_path,status:r.status,adminNote:r.admin_note??"",createdAt:new Date(r.created_at).toLocaleString("zh-CN")}}
export async function withSignedImages(rows:any[]){const db=adminClient();return Promise.all(rows.map(async r=>{const x=mapRow(r);if(x.imageKey){const{data}=await db.storage.from("submission-images").createSignedUrl(x.imageKey,3600);x.imageUrl=data?.signedUrl??null}return x}))}
export async function approved(){
  const archived = localPublished as Submission[];
  const archivedIds = new Set(archived.map((row) => row.id));
  try {
    const { data } = await adminClient()
      .from("submissions")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    const newRows = (data ?? []).filter((row) => !archivedIds.has(row.id));
    const live = await withSignedImages(newRows);
    return [...live, ...archived].sort((a, b) => b.id - a.id);
  } catch {
    // The archived public site remains available even when Supabase is paused.
    return archived;
  }
}
