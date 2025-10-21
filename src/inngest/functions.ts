import { streamText } from "ai";

import { openai } from "@ai-sdk/openai";

import { userId } from "@/mock";

import { inngest } from "./client";

export const chat = inngest.createFunction(
  { id: "chat" },
  { event: "chat/start" },
  async ({ step, publish }) => {
    await step.run("ai-stream", async () => {
      const { textStream } = streamText({
        model: openai("gpt-4.1-mini"),
        messages: [
          { role: "user", content: "Explain why developers love Inngest?" },
        ],
      });
      for await (const textPart of textStream) {
        console.log("AI Stream Part:", textPart);
        await publish({
          channel: `user:${userId}`,
          topic: "ai",
          data: {
            message: textPart,
          },
        });
      }
    });
    return { success: true };
  }
);
