import { supabase } from "./supabase";

export async function submitCreatorApplication(
  creatorType: string,
  contentIdea: string,
  creatorReason: string,
) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const accountId = sessionData.session?.user.id;

  if (!accountId) {
    throw new Error("You must be signed in to apply.");
  }

  const { data, error } = await supabase
    .from("creator_applications")
    .insert({
      account_id: accountId,
      creator_type: creatorType,
      content_idea: contentIdea.trim(),
      creator_reason: creatorReason.trim(),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
