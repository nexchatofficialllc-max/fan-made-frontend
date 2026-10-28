import { supabase } from "./supabase";

export async function isFollowing(accountId: string) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const currentAccountId = sessionData.session?.user.id;

  if (!currentAccountId || !accountId || currentAccountId === accountId) {
    return false;
  }

  const { data, error } = await supabase
    .from("account_follows")
    .select("following_account_id")
    .eq("follower_account_id", currentAccountId)
    .eq("following_account_id", accountId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function followAccount(accountId: string) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const currentAccountId = sessionData.session?.user.id;

  if (!currentAccountId) {
    throw new Error("You must be signed in to follow an account.");
  }

  if (currentAccountId === accountId) {
    throw new Error("You cannot follow your own account.");
  }

  const { error } = await supabase
    .from("account_follows")
    .insert({
      follower_account_id: currentAccountId,
      following_account_id: accountId,
    });

  if (error) throw error;
}

export async function unfollowAccount(accountId: string) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const currentAccountId = sessionData.session?.user.id;

  if (!currentAccountId) {
    throw new Error("You must be signed in to unfollow an account.");
  }

  const { error } = await supabase
    .from("account_follows")
    .delete()
    .eq("follower_account_id", currentAccountId)
    .eq("following_account_id", accountId);

  if (error) throw error;
}
