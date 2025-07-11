"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Message, BotMessage } from "../../types/types";
import ReactMarkdown from "react-markdown";
import TokenInfo from "../TokenInfo/TokenInfo";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { isUser, isBot } from "@/lib/utils";

const Conversation = ({ messages }: { messages: Message[] }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("MainPage");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-white/60">
          <Bot className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-semibold mb-2">
            {t("startConversation")}
          </h3>
          <p>{t("askQuestion")}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scroll">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${
            isUser(msg.sender) ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <Avatar
            className={`size-8 ${
              isUser(msg.sender) ? "bg-blue-600" : "bg-slate-600"
            }`}
          >
            <AvatarFallback className="text-white bg-transparent">
              {isUser(msg.sender) ? (
                <User className="size-4" />
              ) : (
                <Bot className="size-4" />
              )}
            </AvatarFallback>
          </Avatar>

          <div
            className={`flex-1 max-w-[80%] ${
              isUser(msg.sender) ? "text-right" : "text-left"
            }`}
          >
            <Card
              className={`p-4 ${
                isUser(msg.sender)
                  ? "bg-blue-600/20 border-blue-500/30 ml-auto"
                  : "bg-slate-700/20 border-slate-500/30"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="font-medium">
                    {isUser(msg.sender) ? t("you") : t("aiAssistant")}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString("pl-PL", {
                      hour12: false,
                    })}
                  </span>
                </div>

                <div className="text-white/90">
                  {isBot(msg.sender) ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                {isBot(msg.sender) &&
                  (msg as BotMessage).totalTokenCount !== undefined && (
                    <TokenInfo {...(msg as BotMessage)} />
                  )}
              </div>
            </Card>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default Conversation;
