"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatbotWindow from "./ChatbotWindow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("ChatbotWidget");
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && <ChatbotWindow onClose={() => setIsOpen(false)} />}
      <TooltipProvider>
        <div className="fixed bottom-4 right-4 z-50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleChat}
                size="lg"
                className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <MessageCircle className="h-6 w-6" />
                )}
                <span className="sr-only">
                  {isOpen ? t("close") : t("open")}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isOpen ? t("close") : t("open")}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </>
  );
};

export default ChatbotWidget;
