import { ChatGPTAPI } from "chatgpt";

const chatClient = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY as string });

export default chatClient;
