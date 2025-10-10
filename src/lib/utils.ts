import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind and conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sends a message to your Discord Webhook.
 */
export async function logToDiscord(message: string) {
  try {
    await fetch(import.meta.env.VITE_DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
  } catch (err) {
    console.error("❌ Discord logging error:", err);
  }
}

export async function logSignUp(user: any) {
  const timestamp = new Date().toLocaleString();
  await logToDiscord(`🆕 **New account created**
**Name:** ${user.user_metadata?.username || "Unknown"}
**User ID:** ${user.id}
**Email:** ${user.email}
**Time:** ${timestamp}`);
}

export async function logLogin(user: any, session: any) {
  const timestamp = new Date().toLocaleString();
  await logToDiscord(`🟢 **New login detected**
**Full Name:** ${user.user_metadata?.full_name || "Unknown"}
**Username:** ${user.user_metadata?.username || "Unknown"}
**Email:** ${user.email}
**User ID:** ${user.id}
**Time:** ${timestamp}
**Provider:** ${user.app_metadata?.provider || "Unknown"}
**Session expires at:** ${
    session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "N/A"
  }`);
}

export async function logLogout(user: any) {
  await logToDiscord(`🔴 **User logged out**
**Email:** ${user.email}
**User ID:** ${user.id}`);
}

export async function logProfileEdit(user: any, updates: Record<string, any>) {
  await logToDiscord(`✏️ **Profile updated**
**User:** ${user.email}
**Changes:** \`\`\`json
${JSON.stringify(updates, null, 2)}
\`\`\``);
}

export async function logAddToCart(user: any, product: any) {
  await logToDiscord(`🛒 **Item added to cart**
**Product:** ${product.name}
**Price:** $${product.price}
**User:** ${user?.email || "Guest"}`);
}

export async function logNewOrder(order: any) {
  await logToDiscord(`💳 **New order created**
**User:** ${order.user_email}
**Items:** ${order.items.map((i: any) => i.name).join(", ")}
**Total:** $${order.total}`);
}
