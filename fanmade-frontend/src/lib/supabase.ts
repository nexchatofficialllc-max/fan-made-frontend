import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables");
}

const authOptions =
  Platform.OS === "web"
    ? {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      }
    : {
        storage: require("@react-native-async-storage/async-storage").default,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      };

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: authOptions,
  },
);
