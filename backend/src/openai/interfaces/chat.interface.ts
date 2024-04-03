import OpenAI from 'openai';

export interface IChatRequest {
  messages: OpenAI.Chat.ChatCompletionMessage[];
}

export interface IChatResponse {
  success: boolean;
  result: OpenAI.ChatCompletion.Choice;
}