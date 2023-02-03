import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationList,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageModel,
  Sidebar,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [response, setResponse] = useState("");
  const [lastMessage, setLastMessage] = useState<MessageModel | null>(null);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    setLastMessage(messages[messages.length - 1]);
  }, [messages]);

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

    const reply = await fetch(process.env.NEXT_PUBLIC_API_URL + "/chat", {
      method: "POST",
      body: JSON.stringify({ message: textContent }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => res.text());

    setIsloading(false);
    setResponse(reply);
  }

  return (
    <main style={{ height: "100vh" }}>
      <MainContainer>
        <Sidebar position="left">
          <ConversationList>
            <Conversation
              name="ChatGPT"
              lastSenderName={lastMessage?.sender}
              info={lastMessage?.message}
            >
              <Avatar
                src="https://i.pinimg.com/originals/90/76/20/907620c9b0163f18f40db959bc76d983.png"
                name="Joe"
                status="available"
              />
            </Conversation>
          </ConversationList>
        </Sidebar>
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
