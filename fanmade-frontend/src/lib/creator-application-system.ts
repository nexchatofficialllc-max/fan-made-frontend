import { supabase } from "./supabase";

export async function submitCreatorApplication(
  creatorType: string,
  contentIdea: string,
  creatorReason: string,
) {
  // Validation — same as screen, so it fails safe even if screen is bypassed
  if (!creatorType || !["Video", "Manga", "Posts", "Mixed"].includes(creatorType)) {
    throw new Error("Choose what you want to create: Video, Manga, Posts, or Mixed.");
  }
  if (!contentIdea.trim()) {
    throw new Error("Describe what you want to make.");
  }
  if (contentIdea.trim().length > 500) {
    throw new Error("Content idea must be 500 characters or less.");
  }
  if (!creatorReason.trim()) {
    throw new Error("Tell us why you want to become a creator.");
  }
  if (creatorReason.trim().length > 500) {
    throw new Error("Reason must be 500 characters or less.");
  }

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const accountId = sessionData.session?.user.id;

  if (!accountId) {
    throw new Error("You must be signed in to apply.");
  }

  // Don't allow duplicate pending application — one pending at a time
  const { data: existing, error: existingError } = await supabase
    .from("creator_applications")
    .select("id, status")
    .eq("account_id", accountId)
    .eq("status", "pending")
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) {
    throw new Error("You already have an application under review. Wait for it to be decided.");
  }

  // Don't allow re-apply if already Creator
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", accountId)
    .maybeSingle();

  if ((profile?.account_type as string)?.toLowerCase() === "creator") {
    throw new Error("You're already a Creator.");
  }

  const { data, error } = await supabase
    .from("creator_applications")
    .insert({
      account_id: accountId,
      creator_type: creatorType,
      content_idea: contentIdea.trim(),
      creator_reason: creatorReason.trim(),
      status: "pending", // Review is NOT instant
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}