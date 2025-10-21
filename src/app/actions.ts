"use server";

import { getSubscriptionToken } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { userId } from "@/mock";

export async function fetchSubscriptionToken() {
  const token = await getSubscriptionToken(inngest, {
    channel: `user:${userId}`,
    topics: ["ai"],
  });

  return token;
}

export async function sendChatMessage(message: string) {
  await inngest.send({
    name: "chat/start",
    data: {
      message,
      sessionId: userId,
    },
  });
}
