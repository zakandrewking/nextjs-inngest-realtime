"use server";

import { getSubscriptionToken } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { userId } from "@/mock";

export async function fetchRealtimeSubscriptionToken() {
  // This creates a token using the Inngest API that is bound to the channel and topic:
  const token = await getSubscriptionToken(inngest, {
    channel: `user:${userId}`,
    topics: ["ai"],
  });

  return token;
}
