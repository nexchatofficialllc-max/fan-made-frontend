import { supabase } from "./supabase";

export type AccountType = "Watcher" | "Creator";

export async function getMyAccountType(): Promise<AccountType | null> {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const accountId = sessionData.session?.user.id;

  if (!accountId) {
    return null; // not logged in
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("account_type, loopa_uid, loopa_username, heylo_username")
    .eq("id", accountId)
    .maybeSingle();

  if (error) throw error;

  // No account_type set yet = Watcher. Creator only after application approved.
  // One account = Loopa + Heylo, so this type applies to both apps.
  const raw = (data?.account_type as string | null)?.toLowerCase();
  if (raw === "creator") return "Creator";
  return "Watcher";
}

// Helper — same session, get full profile for Settings / Profile screens
export async function getMyProfile() {
  const { data: sessionData } = await supabase.auth.getSession();
  const accountId = sessionData.session?.user.id;
  if (!accountId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, loopa_uid, loopa_username, heylo_username, account_type")
    .eq("id", accountId)
    .maybeSingle();

  if (error) throw error;
  return data;
}