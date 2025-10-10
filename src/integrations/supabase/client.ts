import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import {
  logLogin,
  logLogout,
  logSignUp,
  logProfileEdit,
  logAddToCart,
  logNewOrder,
} from "@/lib/utils";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

let hasEmittedInitialSession = false;

// check if already logged in
(async () => {
  const { data } = await supabase.auth.getSession();
  if (data.session) hasEmittedInitialSession = true;
})();

supabase.auth.onAuthStateChange(async (event, session) => {
  const user = session?.user;

  if (event === "SIGNED_IN" && user) {
    if (!hasEmittedInitialSession) {
      hasEmittedInitialSession = true;
      return;
    }

    const created = new Date(user.created_at).getTime();
    const lastLogin = new Date(user.last_sign_in_at ?? "").getTime();

    if (Math.abs(created - lastLogin) < 5000) {
      await logSignUp(user);
    } else {
      await logLogin(user, session);
    }
  }

  if (event === "SIGNED_OUT" && user) {
    await logLogout(user);
  }
});

// catch signup through USER_UPDATED
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "USER_UPDATED" && session?.user) {
    const user = session.user;
    const now = Date.now();
    const created = new Date(user.created_at).getTime();
    if (now - created < 10000) {
      await logSignUp(user);
    }
  }
});

export async function updateProfile(user: any, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (!error) await logProfileEdit(user, updates);
  else console.error("❌ Profile update error:", error);

  return { data, error };
}

export async function addToCart(user: any, product: any, cartStore: any) {
  cartStore.add(product);
  await logAddToCart(user, product);
}

export async function createOrder(order: any) {
  const { data, error } = await supabase.from("orders").insert(order);

  if (!error) await logNewOrder(order);
  else console.error("❌ Order creation error:", error);

  return { data, error };
}
