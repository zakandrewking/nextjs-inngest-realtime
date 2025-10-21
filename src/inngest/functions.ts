import { streamText } from "ai";

import { openai } from "@ai-sdk/openai";

import { userId } from "@/mock";

import { inngest } from "./client";

export const chat = inngest.createFunction(
  { id: "chat" },
  { event: "chat/start" },
  async ({ event, step, publish }) => {
    const { message, sessionId = userId } = event.data;

    await step.run("ai-stream", async () => {
      const { textStream } = streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant. Be concise and friendly.",
          },
          { role: "user", content: message },
        ],
      });

      let fullResponse = "";

      for await (const textPart of textStream) {
        fullResponse += textPart;
        await publish({
          channel: `user:${sessionId}`,
          topic: "ai",
          data: {
            role: "assistant",
            content: fullResponse,
            isStreaming: true,
          },
        });
      }

      // Send final message to indicate streaming is complete
      await publish({
        channel: `user:${sessionId}`,
        topic: "ai",
        data: {
          role: "assistant",
          content: fullResponse,
          isStreaming: false,
        },
      });
    });

    return { success: true };
  }
);
