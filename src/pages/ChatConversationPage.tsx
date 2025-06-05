import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageList, Input } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

interface MessagesMap {
  [key: string]: any[];
}

const initialMessages: MessagesMap = {
  kursat: [
    {
      position: 'left',
      type: 'text',
      text: "Why don't we go to the mall this weekend ?",
      date: new Date(),
    },
  ],
  emre: [
    {
      position: 'left',
      type: 'text',
      text: 'Send me our photos.',
      date: new Date(),
    },
  ],
  abdurrahim: [
    {
      position: 'left',
      type: 'text',
      text: 'Hey ! Send me the animation video please.',
      date: new Date(),
    },
  ],
  esra: [
    {
      position: 'left',
      type: 'text',
      text: 'I need a random voice.',
      date: new Date(),
    },
  ],
  bensu: [
    {
      position: 'left',
      type: 'text',
      text: 'Send your location.',
      date: new Date(),
    },
  ],
  burhan: [
    {
      position: 'left',
      type: 'text',
      text: 'Recommend me some songs.',
      date: new Date(),
    },
  ],
  abdurrahman: [
    {
      position: 'left',
      type: 'text',
      text: 'Where is the presentation file ?',
      date: new Date(),
    },
  ],
  ahmet: [
    {
      position: 'left',
      type: 'text',
      text: "Let's join the daily meeting.",
      date: new Date(),
    },
  ],
};

const ChatConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<any[]>(
    initialMessages[id ?? ''] || []
  );
  const [text, setText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        position: 'right',
        type: 'text',
        text,
        date: new Date(),
      },
    ]);
    setText('');
  };

  return (
    <div className="chat-container">
      <Link to="/chat" style={{ display: 'block', marginBottom: 8 }}>
        Back
      </Link>
      <MessageList
        className="message-list"
        referance={listRef}
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={messages}
      />
      <Input
        placeholder="Type here..."
        value={text}
        onChange={(e: any) => setText(e.target.value)}
        rightButtons={<button onClick={handleSend}>Send</button>}
      />
    </div>
  );
};

export default ChatConversationPage;
