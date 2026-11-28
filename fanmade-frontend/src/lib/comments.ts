export type Comment = {
  id: string;
  text: string;
  author_id: string;
  is_fami?: boolean;
  author?: { username?: string };
  replies?: Comment[];
};

let store: Record<string, Comment[]> = {
  demo: [
    { id: "1", text: "This loop is so good!", author_id: "user1", author: { username: "ava_loops" }, replies: [] },
    { id: "2", text: "Join the loop!", author_id: "user2", author: { username: "ken" }, replies: [] },
  ],
};

export async function getComments(contentId: string): Promise<Comment[]> {
  return store[contentId] || store["demo"] || [];
}

export async function addComment(contentId: string, userId: string, text: string): Promise<Comment> {
  const c: Comment = { id: Date.now().toString(), text, author_id: userId, author: { username: "you" }, replies: [] };
  if (!store[contentId]) store[contentId] = [];
  store[contentId].push(c);
  return c;
}

export async function likeComment(commentId: string, userId: string): Promise<void> {
  return;
}

export async function replyToComment(commentId: string, userId: string, text: string): Promise<Comment> {
  const c: Comment = { id: Date.now().toString(), text, author_id: userId, author: { username: "you" }, replies: [] };
  for (const key of Object.keys(store)) {
    const parent = store[key].find((x) => x.id === commentId);
    if (parent) {
      if (!parent.replies) parent.replies = [];
      parent.replies.push(c);
      break;
    }
  }
  return c;
}

export async function askFami(contentId: string, userId: string, text: string): Promise<Comment> {
  const c: Comment = { id: Date.now().toString(), text: `Yep, that's me. Fami here. You asked: ${text}`, author_id: "fami", is_fami: true, author: { username: "fami" }, replies: [] };
  if (!store[contentId]) store[contentId] = [];
  store[contentId].push(c);
  return c;
}