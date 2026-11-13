import { supabase } from "./supabase";

export type Notification = {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: string;
  video_id: string | null;
  comment_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function getUnreadCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("is_read", false);
  return count ?? 0;
}

export async function markAsRead(notificationId: string, userId: string) {
  await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId).eq("recipient_id", userId);
}

export async function markAllAsRead(userId: string) {
  await supabase.from("notifications").update({ is_read: true }).eq("recipient_id", userId).eq("is_read", false);
}