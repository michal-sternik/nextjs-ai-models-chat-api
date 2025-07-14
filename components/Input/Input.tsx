"use client";

import { Button } from "@/components/ui/button";
import { Input as UIInput } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Send, Paperclip, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { MISTRAL_FILE_PURPOSE } from "@/settings";
import {
  MISTRAL_OCR_SUPPORTED_FILE_TYPES,
  MISTRAL_BATCH_FINETUNING_SUPPORTED_FILE_TYPES,
} from "@/lib/constants/constants";

interface InputProps {
  sendMessage: (
    input: string,
    setInput: (string: string) => void,
    file?: File,
    selectedModel?: string
  ) => void;
  clearChat: () => void;
  selectedModel: string;
  isLoading?: boolean;
  file?: File;
  handleFileSelection: (file: File | undefined) => void;
}

const Input = ({
  sendMessage,
  selectedModel,
  clearChat,
  isLoading,
  file,
  handleFileSelection,
}: InputProps) => {
  const [input, setInput] = useState("");
  const t = useTranslations("MainPage");

  const handleSend = () => {
    sendMessage(input, setInput, file, selectedModel);
  };

  return (
    <div className="space-y-3">
      {file && (
        <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Paperclip className="size-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">
              {file.name}
            </span>
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-200 border-blue-500/30 text-xs"
            >
              {(file.size / 1024).toFixed(1)} KB
            </Badge>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => handleFileSelection(undefined)}
                size="sm"
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 h-6 w-6 p-0"
              >
                <X className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("removeFile")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="flex items-center gap-2 p-2 bg-slate-800/50  rounded-xl border border-blue-500/20">
        <UIInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) handleSend();
          }}
          placeholder={t("typeMessage")}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/50"
          disabled={isLoading}
        />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <label>
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
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-blue-500/20"
                  disabled={isLoading}
                  asChild
                >
                  <span className="cursor-pointer">
                    <Paperclip className="size-4" />
                  </span>
                </Button>
              </label>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {t("attachFile")}
                {selectedModel === "mistral-3.2-small" &&
                MISTRAL_FILE_PURPOSE?.toLowerCase?.() === "ocr" ? (
                  <span className="block text-xs text-muted-foreground mt-1">
                    {t("fileSupports")}: {t("fileSupportsImages")}
                  </span>
                ) : (
                  <span className="block text-xs text-muted-foreground mt-1">
                    {t("fileSupports")}: {t("fileSupportsJsonl")}
                  </span>
                )}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleSend}
                size="sm"
                disabled={isLoading || (!input.trim() && !file)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("sendMessage")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={clearChat}
                size="sm"
                variant="destructive"
                disabled={isLoading}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
              >
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("clearChat")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Input;
