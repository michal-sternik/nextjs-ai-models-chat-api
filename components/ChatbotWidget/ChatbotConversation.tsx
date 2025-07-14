"use client";

import { useRef, useEffect } from "react";
import type { Message } from "../../types/types";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { isUser } from "@/lib/utils";
import { isBot } from "@/lib/utils";

interface ChatbotConversationProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatbotConversation = ({
  messages,
  isLoading,
}: ChatbotConversationProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scroll">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-2 ${
            isUser(msg.sender) ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Avatar
            className={`size-6 ${
              isUser(msg.sender) ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <AvatarFallback className="text-white bg-transparent">
              {isUser(msg.sender) ? (
                <User className="size-3" />
              ) : (
                <Bot className="size-3" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="max-w-[80%]  text-left">
            <div
              className={`p-2 rounded-lg text-sm ${
                isUser(msg.sender)
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {isBot(msg.sender) ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap text-left">{msg.text}</p>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-2">
          <Avatar className="size-6 bg-gray-600">
            <AvatarFallback className="text-white bg-transparent">
              <Bot className="size-3" />
            </AvatarFallback>
          </Avatar>
          <div className="bg-gray-100 p-2 rounded-lg">
            <div className="flex gap-1">
              <div className="size-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="size-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="size-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
};

export default ChatbotConversation;
