"use client";

import { Button } from "@/components/ui/button";
import { X, Bot } from "lucide-react";
import { useChat } from "../../hooks/useChat";
import ChatbotConversation from "./ChatbotConversation";
import ChatbotInput from "./ChatbotInput";
import { useTranslations } from "next-intl";

interface ChatbotWindowProps {
  onClose: () => void;
}

const ChatbotWindow = ({ onClose }: ChatbotWindowProps) => {
  const selectedModel = "mistral-3.2-small";
  const { messages, isLoading, sendMessage, file, handleFileSelection } =
    useChat(`chatbot-${selectedModel}`);
  const t = useTranslations("ChatbotWidget");

  return (
    <div
      className=" fixed flex flex-col
        bg-white/95 border-blue-500/30 shadow-2xl rounded-xl
        inset-4
        bottom-20 md:right-4 md:left-auto md:top-auto
        md:w-1/3 md:h-2/3 md:min-w-100"
    >
      <div className="flex w-full flex-row items-center justify-between p-4 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{t("title")}</h3>
            <p className="text-xs text-gray-600">{t("status")}</p>
          </div>
        </div>
        <Button
          onClick={onClose}
          size="sm"
          variant="ghost"
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden ">
        {/* <div className=" flex flex-1 flex-col "> */}
        <ChatbotConversation messages={messages} isLoading={isLoading} />

        <div className="p-3 border-t border-blue-500/20">
          <ChatbotInput
            sendMessage={(input, setInput, file) =>
              sendMessage(input, setInput, file, selectedModel)
            }
            isLoading={isLoading}
            file={file}
            handleFileSelection={handleFileSelection}
            selectedModel={selectedModel}
          />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default ChatbotWindow;
