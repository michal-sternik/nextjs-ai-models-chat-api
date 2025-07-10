"use client";

import { useRef, useEffect } from "react";
import type { Message } from "../../types/types";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";

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
            msg.sender === "user" ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Avatar
            className={`w-6 h-6 ${
              msg.sender === "user" ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <AvatarFallback className="text-white bg-transparent">
              {msg.sender === "user" ? (
                <User className="w-3 h-3" />
              ) : (
                <Bot className="w-3 h-3" />
              )}
            </AvatarFallback>
          </Avatar>

          <div
            className={`max-w-[80%] ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`p-2 rounded-lg text-sm ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {msg.sender === "bot" ? (
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
          <Avatar className="w-6 h-6 bg-gray-600">
            <AvatarFallback className="text-white bg-transparent">
              <Bot className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
          <div className="bg-gray-100 p-2 rounded-lg">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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
