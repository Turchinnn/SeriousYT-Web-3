import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind and conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sends a beautiful embed message to Discord Webhook.
 */
export async function logToDiscord(title: string, description: string, color = 0x2b2d31) {
  try {
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

    // Discord embed payload
    const payload = {
      embeds: [
        {
          title,
          description,
          color,
          timestamp: new Date().toISOString(),
          footer: { text: "🪶 Supabase Logger" },
        },
      ],
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("❌ Discord logging error:", err);
  }
}

/* ---------- Log event helpers ---------- */

export async function logSignUp(user: any) {
  await logToDiscord(
    "🆕 New Account Created",
    `**Name:** ${user.user_metadata?.username || "Unknown"}\n` +
      `**Email:** ${user.email}\n` +
      `**User ID:** ${user.id}\n` +
      `**Time:** ${new Date().toLocaleString()}`,
    0x00ff99
  );
}

export async function logLogin(user: any, session: any) {
  await logToDiscord(
    "🟢 New Login Detected",
    `**Full Name:** ${user.user_metadata?.full_name || "Unknown"}\n` +
      `**Username:** ${user.user_metadata?.username || "Unknown"}\n` +
      `**Email:** ${user.email}\n` +
      `**User ID:** ${user.id}\n` +
      `**Provider:** ${user.app_metadata?.provider || "Unknown"}\n` +
      `**Session Expires:** ${
        session?.expires_at
          ? new Date(session.expires_at * 1000).toLocaleString()
          : "N/A"
      }\n` +
      `**Time:** ${new Date().toLocaleString()}`,
    0x00aaff
  );
}

export async function logLogout(user: any) {
  await logToDiscord(
    "🔴 User Logged Out",
    `**Email:** ${user.email}\n**User ID:** ${user.id}`,
    0xff4444
  );
}

export async function logProfileEdit(user: any, updates: Record<string, any>) {
  await logToDiscord(
    "✏️ Profile Updated",
    `**User:** ${user.email}\n**Changes:**\n\`\`\`json\n${JSON.stringify(
      updates,
      null,
      2
    )}\n\`\`\``,
    0xffcc00
  );
}

export async function logAddToCart(user: any, product: any) {
  await logToDiscord(
    "🛒 Item Added to Cart",
    `**Product:** ${product.name}\n**Price:** $${product.price}\n**User:** ${
      user?.email || "Guest"
    }`,
    0x5865f2
  );
}

export async function logNewOrder(order: any) {
  await logToDiscord(
    "💳 New Order Created",
    `**User:** ${order.user_email}\n` +
      `**Items:** ${order.items.map((i: any) => i.name).join(", ")}\n` +
      `**Total:** $${order.total}`,
    0x00cc66
  );
}
