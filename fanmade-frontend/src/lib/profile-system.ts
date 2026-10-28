import { supabase } from "./supabase";

export type PublicProfile = {
  id: string;
  username: string | null;
  account_type: string | null;
};

export async function getPublicProfile(accountId: string) {
  if (!accountId) {
    throw new Error("Missing account ID.");
  }

  const { data, error } = await supabase
    .from("public_profiles")
    .select("id, username, account_type")
    .eq("id", accountId)
    .maybeSingle();

  if (error) throw error;

  return data as PublicProfile | null;
}
