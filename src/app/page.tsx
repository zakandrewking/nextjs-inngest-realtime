"use client";

import { useState, useEffect, useRef } from "react";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchSubscriptionToken, sendChatMessage } from "./actions";

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { latestData, error } = useInngestSubscription({
    refreshToken: fetchSubscriptionToken,
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle incoming AI responses
  useEffect(() => {
    if (latestData && latestData.data?.role === "assistant") {
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        // If the last message is an assistant message that's streaming, update it
        if (lastMessage?.role === "assistant" && lastMessage.isStreaming) {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: latestData.data.content,
            isStreaming: latestData.data.isStreaming,
          };
          return newMessages;
        }

        // If the last message is not streaming or is a user message, add new assistant message
        if (!lastMessage || lastMessage.role !== "assistant" || !lastMessage.isStreaming) {
          return [
            ...prev,
            {
              role: "assistant",
              content: latestData.data.content,
              isStreaming: latestData.data.isStreaming,
            },
          ];
        }

        return prev;
      });

      // If streaming is complete, set loading to false
      if (!latestData.data.isStreaming) {
        setIsLoading(false);
      }
    }
  }, [latestData]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    // Send event to Inngest via server action
    try {
      await sendChatMessage(userMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <header className="py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold">AI Chat with Inngest Realtime</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Powered by Inngest realtime streaming
        </p>
      </header>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Send a message to start chatting!</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="text-center text-red-500 py-2">
            Error: {error.message}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
