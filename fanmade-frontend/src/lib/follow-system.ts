import { supabase } from "./supabase";

// Loopa naming:
// - You follow a Creator = you become their Fan
// - Table `account_follows` stays the same in Supabase so you don't break DB
//   follower_account_id = Fan
//   following_account_id = Creator

export async function isFan(creatorAccountId: string) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const currentAccountId = sessionData.session?.user.id;

  if (!currentAccountId || !creatorAccountId || currentAccountId === creatorAccountId) {
    return false;
  }

  const { data, error } = await supabase
    .from("account_follows")
    .select("following_account_id")
    .eq("follower_account_id", currentAccountId)
    .eq("following_account_id", creatorAccountId)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

export async function fanCreator(creatorAccountId: string) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const currentAccountId = sessionData.session?.user.id;

  if (!currentAccountId) {
    throw new Error("You must be signed in to fan a creator.");
  }

  if (currentAccountId === creatorAccountId) {
    throw new Error("You cannot fan your own account.");
  }

  // Don't double-fan — check first, don't rely on DB error
  const already = await isFan(creatorAccountId);
  if (already) return;

  const { error } = await supabase
    .from("account_follows")
    .insert({
      follower_account_id: currentAccountId,
      following_account_id: creatorAccountId,
    });

  if (error) throw error;
}

export async function unfanCreator(creatorAccountId: string) {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const currentAccountId = sessionData.session?.user.id;

  if (!currentAccountId) {
    throw new Error("You must be signed in to unfan a creator.");
  }

  const { error } = await supabase
    .from("account_follows")
    .delete()
    .eq("follower_account_id", currentAccountId)
    .eq("following_account_id", creatorAccountId);

  if (error) throw error;
}

// Helpers for Profile screens — Fans count + Creators count
export async function getFansCount(accountId: string) {
  const { count, error } = await supabase
    .from("account_follows")
    .select("following_account_id", { count: "exact", head: true })
    .eq("following_account_id", accountId);
  if (error) throw error;
  return count ?? 0;
}

export async function getCreatorsCount(accountId: string) {
  const { count, error } = await supabase
    .from("account_follows")
    .select("follower_account_id", { count: "exact", head: true })
    .eq("follower_account_id", accountId);
  if (error) throw error;
  return count ?? 0;
}

// --- Old names kept so existing screens don't break ---
// Use the new names in new code: isFan / fanCreator / unfanCreator
export const isFollowing = isFan;
export const followAccount = fanCreator;
export const unfollowAccount = unfanCreator;