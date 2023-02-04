import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageModel,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [response, setResponse] = useState("");
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    if (!response) return;
    setMessages([
      ...messages,
      {
        direction: "incoming",
        message: response,
        position: "normal",
        sender: "ChatGPT",
      },
    ]);
    setResponse("");
  }, [messages, response]);

  async function handleSend(
    innerHtml: string,
    textContent: string,
    innerText: string,
    nodes: NodeList
  ) {
    setIsloading(true);
    setMessages([
      ...messages,
      {
        direction: "outgoing",
        message: textContent,
        position: "normal",
        sender: "Me",
      },
    ]);

    const reply = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + "/chat",
      { message: textContent },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    setIsloading(false);
    setResponse(reply.data);
  }

  return (
    <main>
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isloading && <TypingIndicator content="ChatGPT is thinking..." />
            }
          >
            {messages.map((msg, i) => (
              <Message key={i} model={msg} />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            attachButton={false}
            onSend={handleSend}
          />
        </ChatContainer>
      </MainContainer>
    </main>
  );
}
