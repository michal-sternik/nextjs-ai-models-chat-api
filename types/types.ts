export interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: number
}

export interface BotMessage extends Message {
  promptTokenCount: number
  candidatesTokenCount: number
  totalTokenCount: number
}
