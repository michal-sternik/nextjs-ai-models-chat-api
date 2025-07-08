import { Mistral } from "@mistralai/mistralai";
import type { BotMessage, Message } from "../types/types";
import { generateId } from "../lib/utils/generateId";
import {
  MISTRAL_TEMPERATURE,
  MISTRAL_MAX_TOKENS,
  MISTRAL_FILE_PURPOSE,
} from "@/settings";

const client = new Mistral({
  apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY!,
});

export const sendMistralMessage = async (
  messages: Message[],
  input: string,
  numberOfPreviousMessagesAttached: number,
  file?: File
): Promise<BotMessage> => {
  const recentMessages =
    numberOfPreviousMessagesAttached > 0 && messages && messages.length > 0
      ? messages.slice(-numberOfPreviousMessagesAttached)
      : [];

  const conversationHistory = recentMessages.map((msg) =>
    msg.sender === "bot"
      ? { role: "assistant" as const, content: msg.text }
      : { role: "user" as const, content: msg.text }
  );

  if (!file) {
    const currentMessage: { role: "user" | "assistant"; content: string } = {
      role: "user",
      content: input,
    };
    const allMessages = [...conversationHistory, currentMessage];

    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-medium-2505",
        messages: allMessages,
        temperature: MISTRAL_TEMPERATURE ?? 0.7,
        maxTokens: MISTRAL_MAX_TOKENS ?? 1000,
      });

      const text =
        (chatResponse.choices?.[0]?.message?.content as string) ||
        "No response";

      return {
        id: generateId(),
        sender: "bot",
        text,
        timestamp: Date.now(),
        promptTokenCount: chatResponse.usage?.promptTokens,
        candidatesTokenCount: chatResponse.usage?.completionTokens,
        totalTokenCount: chatResponse.usage?.totalTokens,
      };
    } catch (error) {
      console.error("Mistral API error:", error);
      throw new Error(
        `Mistral API error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  } else {
    let uploadedFile, signedUrl;
    try {
      uploadedFile = await client.files.upload({
        file: { fileName: file.name, content: await file.arrayBuffer() },
        purpose: MISTRAL_FILE_PURPOSE,
      });
      signedUrl = await client.files.getSignedUrl({
        fileId: uploadedFile.id,
      });
    } catch (e) {
      console.error("File upload failed:", e);
      // throw new Error(
      // `File upload failed: ${file?.name ?? ""} ${
      //   e instanceof Error ? e.message : String(e)
      // }`
      // );
      return await sendExtractedFileAsPrompt(conversationHistory, input, file);
    }

    const contextParts = conversationHistory.map((msg) => ({
      role: msg.role,
      content: [{ type: "text" as const, text: msg.content }],
    }));

    const userMessage = {
      role: "user" as const,
      content: [
        { type: "text" as const, text: input },
        { type: "document_url" as const, documentUrl: signedUrl.url },
      ],
    };
    const allMessages = [...contextParts, userMessage];
    try {
      const chatResponse = await client.chat.complete({
        model: "mistral-small-latest",
        messages: allMessages,
        temperature: MISTRAL_TEMPERATURE || 0.7,
        maxTokens: MISTRAL_MAX_TOKENS || 1000,
      });

      const text =
        (chatResponse.choices?.[0]?.message?.content as string) ||
        "No response";

      return {
        id: generateId(),
        sender: "bot",
        text,
        timestamp: Date.now(),
        promptTokenCount: chatResponse.usage?.promptTokens,
        candidatesTokenCount: chatResponse.usage?.completionTokens,
        totalTokenCount: chatResponse.usage?.totalTokens,
      };
    } catch (error) {
      console.error("Mistral API error:", error);
      throw new Error(
        `Mistral API error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

async function sendExtractedFileAsPrompt(
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  input: string,
  file: File
): Promise<BotMessage> {
  const extractedText = await extractTextFromFile(file);

  const contextParts = conversationHistory.map((msg) => ({
    role: msg.role,
    content: [{ type: "text" as const, text: msg.content }],
  }));

  const userMessage = {
    role: "user" as const,
    content: [
      {
        type: "text" as const,
        text: `${input}\n\n[Zawartość pliku:]\n${extractedText}`,
      },
    ],
  };

  const allMessages = [...contextParts, userMessage];

  const chatResponse = await client.chat.complete({
    model: "mistral-small-latest",
    messages: allMessages,
    temperature: MISTRAL_TEMPERATURE || 0.7,
    maxTokens: MISTRAL_MAX_TOKENS || 1000,
  });

  const text =
    (chatResponse.choices?.[0]?.message?.content as string) || "No response";

  const info =
    "[File upload failed. Emergency fallback activated: file content was extracted programmatically and sent as prompt.]\n\n---\n\n";

  return {
    id: generateId(),
    sender: "bot",
    text: info + text,
    timestamp: Date.now(),
    promptTokenCount: chatResponse.usage?.promptTokens,
    candidatesTokenCount: chatResponse.usage?.completionTokens,
    totalTokenCount: chatResponse.usage?.totalTokens,
  };
}

async function extractTextFromFile(file: File): Promise<string> {
  // TXT
  if (file.type === "text/plain") {
    return await file.text();
  }

  // JSON
  if (file.type === "application/json" || file.name.endsWith(".json")) {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      return JSON.stringify(json, null, 2);
    } catch {
      return "[Błąd podczas parsowania pliku JSON]";
    }
  }

  // CSV
  if (file.type === "text/csv" || file.name.endsWith(".csv")) {
    return await file.text();
  }

  // Markdown
  if (file.type === "text/markdown" || file.name.endsWith(".md")) {
    return await file.text();
  }

  // HTML
  if (
    file.type === "text/html" ||
    file.name.endsWith(".html") ||
    file.name.endsWith(".htm")
  ) {
    return await file.text();
  }

  // Default fallback for unsupported file types
  return "[Nieobsługiwany typ pliku lub nie można wyodrębnić tekstu]";
}
