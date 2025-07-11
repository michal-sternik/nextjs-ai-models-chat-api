"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input as UIInput } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send, Paperclip, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { MISTRAL_FILE_PURPOSE } from "@/settings";
import {
  MISTRAL_OCR_SUPPORTED_FILE_TYPES,
  MISTRAL_BATCH_FINETUNING_SUPPORTED_FILE_TYPES,
} from "@/lib/constants/constants";
import { useTranslations } from "next-intl";

interface ChatbotInputProps {
  sendMessage: (
    input: string,
    setInput: (string: string) => void,
    file?: File
  ) => void;
  isLoading?: boolean;
  file?: File;
  handleFileSelection: (file: File | undefined) => void;
  selectedModel: string;
  clearChat: () => void;
}

const ChatbotInput = ({
  sendMessage,
  isLoading,
  file,
  handleFileSelection,
  selectedModel,
  clearChat,
}: ChatbotInputProps) => {
  const [input, setInput] = useState<string>("");
  const t = useTranslations("ChatbotWidget");
  const handleSend = () => {
    if (input.trim() || file) {
      sendMessage(input, setInput, file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      {file && (
        <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Paperclip className="size-3 text-blue-600" />
            <span className="text-blue-800 text-xs font-medium truncate max-w-32">
              {file.name}
            </span>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
            >
              {(file.size / 1024).toFixed(1)} KB
            </Badge>
          </div>
          <Button
            onClick={() => handleFileSelection(undefined)}
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 h-5 w-5 p-0"
          >
            <X className="size-3" />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <UIInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t("messagePlaceholder")}
            className="text-sm text-black pr-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
            style={{ backgroundColor: "white" }}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <label className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelection(f);
                  }}
                  disabled={isLoading}
                  accept={
                    selectedModel === "mistral-3.2-small" &&
                    MISTRAL_FILE_PURPOSE?.toLowerCase?.() === "ocr"
                      ? MISTRAL_OCR_SUPPORTED_FILE_TYPES.join(",")
                      : MISTRAL_BATCH_FINETUNING_SUPPORTED_FILE_TYPES.join(",")
                  }
                />
                <Paperclip className="size-4 text-gray-400 hover:text-gray-600" />
              </label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("attachFile")}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSend}
              size="sm"
              disabled={isLoading || (!input.trim() && !file)}
              className="bg-blue-600 hover:bg-blue-700 text-white size-9 p-0"
            >
              <Send className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("sendMessage")}</p>
          </TooltipContent>
        </Tooltip>
        {/* trash button only for development purposes */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={clearChat}
              size="sm"
              variant="destructive"
              disabled={isLoading}
              className="bg-red-500/20 hover:bg-red-500/90 border size-9 border-red-500/30"
            >
              <Trash2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {"Only for development purposes"}
              {
                <span className="block text-xs text-muted-foreground mt-1">
                  Delete chat history, chatbot-{selectedModel}
                </span>
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatbotInput;
