"use client";

import { useEffect, useRef, useState } from "react";
import {
  deleteAllGeminiFiles,
  sendGeminiMessage,
} from "../services/geminiService";
import type { BotMessage, Message } from "../types/types";
import { generateId } from "../lib/utils/generateId";
import { SAVE_MAX_MESSAGES } from "../settings";
import { sendMistralMessage } from "@/services/mistralService";

export const useChat = (selectedModel: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialLoad = useRef(true);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [
    numberOfPreviousMessagesAttached,
    setNumberOfPreviousMessagesAttached,
  ] = useState<number>(SAVE_MAX_MESSAGES);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chatMessages-${selectedModel}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [selectedModel]);

  //we have to use useRef to avoid saving the empty state on the first render
  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    localStorage.setItem(
      `chatMessages-${selectedModel}`,
      JSON.stringify(messages)
    );
  }, [messages, selectedModel]);

  const sendMessage = async (
    input: string,
    setInput: (string: string) => void,
    file?: File,
    selectedModel?: string
  ) => {
    if ((!input.trim() && !file) || isLoading) return;
    setIsLoading(true);
    setInput("");

    const userMsg: Message = {
      id: generateId(),
      sender: "user",
      text: file ? `file: ${file.name}; ${input}` : input,
      timestamp: Date.now(),
    };

    setMessages((msgs) => [...msgs, userMsg]);

    try {
      let botMsg: Message;

      if (selectedModel === "mistral-3.2-small") {
        botMsg = await sendMistralMessage(
          messages,
          input,
          numberOfPreviousMessagesAttached,
          file
        );
      } else if (selectedModel === "gemini-2.5-flash") {
        botMsg = await sendGeminiMessage(
          messages,
          input,
          numberOfPreviousMessagesAttached,
          file
        );
      }

      setMessages((msgs) => [...msgs, botMsg]);
      if (file) {
        handleFileSelection(undefined);
      }
      localStorage.setItem(
        `totalTokenCount-${selectedModel}`,
        (
          (Number(localStorage.getItem(`totalTokenCount-${selectedModel}`)) ||
            0) + (botMsg! as BotMessage).totalTokenCount
        ).toString()
      );
    } catch (e) {
      const errorMsg: Message = {
        id: generateId(),
        sender: "bot",
        text: `Error: ${e instanceof Error ? e.message : String(e)}`,
        timestamp: Date.now(),
      };
      setMessages((msgs) => [...msgs, errorMsg]);
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    setFile(undefined);
    localStorage.removeItem(`chatMessages-${selectedModel}`);
    deleteAllGeminiFiles();
    setNumberOfPreviousMessagesAttached(SAVE_MAX_MESSAGES);
  };

  const handleFileSelection = (selectedFile: File | undefined) => {
    setFile(selectedFile);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    file,
    handleFileSelection,
    numberOfPreviousMessagesAttached,
    setNumberOfPreviousMessagesAttached,
  };
};
