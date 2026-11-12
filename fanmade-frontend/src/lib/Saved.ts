import { supabase } from "./supabase";

export async function toggleSave(contentId: string, accountId: string) {
  const { data: existing } = await supabase.from("saved_videos").select("id").eq("content_id", contentId).eq("user_id", accountId).maybeSingle();
  if (existing) {
    await supabase.from("saved_videos").delete().eq("id", existing.id);
    return { saved: false };
  }
  await supabase.from("saved_videos").insert({ content_id: contentId, user_id: accountId });
  return { saved: true };
}