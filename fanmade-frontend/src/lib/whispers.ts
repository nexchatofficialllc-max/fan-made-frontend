// src/lib/whispers.ts — data only, no JSX
export const MAX_WHISPER_MESSAGES = 20;

export type Whisper = {
  id: string;
  commentId: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  createdAt: number;
};

let whispers: Whisper[] = [];

export async function getWhisperConversation(
  commentId: string,
  currentUserId: string,
  recipientId: string
): Promise<Whisper[]> {
  return whispers.filter(
    (w) =>
      w.commentId === commentId &&
      ((w.sender_id === currentUserId && w.recipient_id === recipientId) ||
        (w.sender_id === recipientId && w.recipient_id === currentUserId))
  );
}

export async function sendWhisper(
  commentId: string,
  senderId: string,
  recipientId: string,
  text: string
): Promise<{ message: Whisper }> {
  const existing = await getWhisperConversation(commentId, senderId, recipientId);
  if (existing.length >= MAX_WHISPER_MESSAGES) {
    throw new Error("This Whisper hit 20 messages. Continue in Heylo.");
  }
  const message: Whisper = {
    id: Date.now().toString(),
    commentId,
    sender_id: senderId,
    recipient_id: recipientId,
    text: text.trim(),
    createdAt: Date.now(),
  };
  whispers.push(message);
  return { message };
}