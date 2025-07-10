import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUser = (sender: string) => sender === "user";
export const isBot = (sender: string) => sender === "bot";
