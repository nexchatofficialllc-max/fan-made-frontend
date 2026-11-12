import { supabase } from "./supabase";

export type Comment = {
  id: string;
  content_id: string;
  author_id: string;
  text: string;
  is_fami: boolean;
  created_at: string;
  author?: { username: string; display_name?: string; avatar_url?: string };
  replies?: { id: string; text: string; author_id: string; created_at: string; author?: { username: string } }[];
};

export async function getComments(contentId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(`*, author:profiles!comments_author_id_fkey(username, display_name, avatar_url), replies(*, author:profiles!replies_author_id_fkey(username))`)
    .eq("content_id", contentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function addComment(contentId: string, accountId: string, text: string) {
  const clean = text.trim();
  if (!clean) throw new Error("Comment cannot be empty.");
  const { data, error } = await supabase.from("comments").insert({ content_id: contentId, author_id: accountId, text: clean }).select().single();
  if (error) throw error;
  return data;
}

export async function likeComment(commentId: string, accountId: string) {
  const { data: existing } = await supabase.from("comment_likes").select("comment_id").eq("comment_id", commentId).eq("user_id", accountId).maybeSingle();
  if (existing) {
    await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", accountId);
    return { liked: false };
  }
  await supabase.from("comment_likes").insert({ comment_id: commentId, user_id: accountId });
  return { liked: true };
}

export async function replyToComment(commentId: string, accountId: string, text: string) {
  const clean = text.trim();
  if (!clean) throw new Error("Reply cannot be empty.");
  const { data, error } = await supabase.from("replies").insert({ comment_id: commentId, author_id: accountId, text: clean }).select().single();
  if (error) throw error;
  return data;
}

export async function askFami(contentId: string, accountId: string, question: string) {
  const clean = question.trim();
  if (!clean) throw new Error("Question cannot be empty.");
  await addComment(contentId, accountId, clean);
  const { data, error } = await supabase.from("comments").insert({ content_id: contentId, author_id: accountId, text: `Fami here — you asked: "${clean}". Want me to find similar loops?`, is_fami: true }).select().single();
  if (error) throw error;
  return data;
}