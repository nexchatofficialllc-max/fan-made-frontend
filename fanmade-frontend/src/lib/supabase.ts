// src/lib/supabase.ts — frontend does NOT hold real keys, use backend proxy
// This file only stops the crash in preview. Real data comes from backend /api

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key";

if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  console.warn("Supabase env not set, using placeholder for preview. Real data uses backend proxy.");
}

// Minimal placeholder so imports don't crash. Do not use this for real data.
export const supabase = {
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
    eq: function () { return this; },
    order: function () { return this; },
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
  },
};

export { supabaseUrl, supabasePublishableKey };