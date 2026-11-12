import { supabase } from "./supabase";

export const MAX_WHISPER_MESSAGES = 20;

export type Whisper = {
  id: string;
  comment_id: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  created_at: string;
};

export async function getWhisperConversation(
  commentId: string,
  uid1: string,
  uid2: string
): Promise<Whisper[]> {
  const { data, error } = await supabase
    .from("whispers")
    .select("*")
    .eq("comment_id", commentId)
    .or(`and(sender_id.eq.${uid1},recipient_id.eq.${uid2}),and(sender_id.eq.${uid2},recipient_id.eq.${uid1})`)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function sendWhisper(
  commentId: string,
  senderId: string,
  recipientId: string,
  text: string
) {
  const clean = text.trim();
  if (!clean) throw new Error("Whisper cannot be empty.");
  if (senderId === recipientId) throw new Error("You cannot Whisper yourself.");

  const existing = await getWhisperConversation(commentId, senderId, recipientId);
  if (existing.length >= MAX_WHISPER_MESSAGES) {
    throw new Error("This Whisper has reached its 20-message limit.");
  }

  const { data, error } = await supabase
    .from("whispers")
    .insert({
      comment_id: commentId,
      sender_id: senderId,
      recipient_id: recipientId,
      text: clean,
    })
    .select()
    .single();

  if (error) throw error;
  return { message: data, remaining: MAX_WHISPER_MESSAGES - existing.length - 1 };
}