import { supabase } from "./supabase";

export async function getOrCreateSupportChat() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("You must be signed in to use Fami support.");
  }

  const { data: existingChat, error: chatError } = await supabase
    .from("support_chats")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (chatError) {
    throw chatError;
  }

  if (existingChat) {
    return existingChat;
  }

  const { data: newChat, error: createError } = await supabase
    .from("support_chats")
    .insert({
      user_id: user.id,
      status: "ai",
      subject: "LOOPA Support",
    })
    .select()
    .single();

  if (createError) {
    throw createError;
  }

  return newChat;
}

export async function sendFamiUserMessage(message: string) {
  const cleanedMessage = message.trim();

  if (!cleanedMessage) {
    return null;
  }

  const chat = await getOrCreateSupportChat();

  const { data, error } = await supabase
    .from("support_messages")
    .insert({
      chat_id: chat.id,
      sender_type: "user",
      message: cleanedMessage,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  const { error: updateError } = await supabase
    .from("support_chats")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", chat.id);

  if (updateError) {
    throw updateError;
  }

  return data;
}
