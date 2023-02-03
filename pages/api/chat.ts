import chatClient from "@/backend/chatgpt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).send(req.method + " is not supported");
    return;
  }

  if (!req.body || !req.body.message) {
    res.status(400).send("Missing request message");
    return;
  }

  try {
    const result = await chatClient.sendMessage(req.body.message);
    res.send(result.text);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}
