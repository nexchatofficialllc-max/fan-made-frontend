// src/lib/whispers.ts — data only, no JSX, no Modal
export type Whisper = {
  id: string;
  commentId: string;
  text: string;
  authorId: string;
  createdAt: number;
};

let whispers: Whisper[] = [];

export function getWhispers(commentId: string): Whisper[] {
  return whispers.filter((w) => w.commentId === commentId);
}

export function addWhisper(commentId: string, authorId: string, text: string): Whisper {
  const whisper: Whisper = {
    id: Date.now().toString(),
    commentId,
    text: text.trim(),
    authorId,
    createdAt: Date.now(),
  };
  whispers.push(whisper);
  return whisper;
}

export function clearWhispers(): void {
  whispers = [];
}