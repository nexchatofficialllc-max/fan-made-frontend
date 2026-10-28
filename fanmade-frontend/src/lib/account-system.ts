import { supabase } from "./supabase";

export async function getMyAccountType() {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const accountId = sessionData.session?.user.id;

  if (!accountId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", accountId)
    .maybeSingle();

  if (error) throw error;

  return data?.account_type ?? null;
}
