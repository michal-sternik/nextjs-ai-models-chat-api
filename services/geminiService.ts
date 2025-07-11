import { createPartFromUri, GoogleGenAI } from "@google/genai";
import type { BotMessage, Message } from "../types/types";
import { generateId } from "../lib/utils/generateId";
import {
  GEMINI_THINKING_BUDGET,
  GEMINI_TEMPERATURE,
  GEMINI_MAX_TOKENS,
} from "@/settings";
import { isBot } from "@/lib/utils";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

export const deleteAllGeminiFiles = async (): Promise<void> => {
  const filesPager = await ai.files.list();
  for await (const file of filesPager) {
    if (file.name) {
      await ai.files.delete({ name: file.name });
    }
  }
};

export const sendGeminiMessage = async (
  messages: Message[],
  input: string,
  numberOfPreviousMessagesAttached: number,
  file?: File
): Promise<BotMessage> => {
  let contents;
  let filePart;

  const recentMessages =
    numberOfPreviousMessagesAttached > 0 && messages && messages.length > 0
      ? messages.slice(-numberOfPreviousMessagesAttached)
      : [];

  //if we include a file
  if (file) {
    //change file name to match gemini requirements
    const sanitizedFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    filePart = await ai.files.upload({
      file: file,
      config: {
        mimeType: file.type,
        displayName: file.name,
        name: sanitizedFileName,
      },
    });

    const contextParts = recentMessages.map((msg) => ({
      role: isBot(msg.sender) ? "model" : msg.sender,
      parts: [{ text: msg.text }],
    }));

    const filePartContent = {
      role: "user",
      parts: [createPartFromUri(filePart.uri!, filePart.mimeType!)],
    };

    const inputPartContent = {
      role: "user",
      parts: [{ text: input }],
    };

    contents = [...contextParts, filePartContent, inputPartContent];

    //else only text input
  } else {
    const fullMessages = [...recentMessages, { text: input, sender: "user" }];

    contents = fullMessages.map((msg) => ({
      role: isBot(msg.sender) ? "model" : msg.sender,
      parts: [{ text: msg.text }],
    }));
  }
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      thinkingConfig: { thinkingBudget: GEMINI_THINKING_BUDGET ?? 10000 },
      temperature: GEMINI_TEMPERATURE ?? 1.0,
      maxOutputTokens: GEMINI_MAX_TOKENS ?? 100000,
    },
  });

  const text =
    result.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  const usage = result.usageMetadata || {};

  return {
    id: generateId(),
    sender: "bot",
    text,
    timestamp: Date.now(),
    promptTokenCount: usage.promptTokenCount ?? 0,
    candidatesTokenCount: usage.candidatesTokenCount ?? 0,
    totalTokenCount: usage.totalTokenCount ?? 0,
  };
};
