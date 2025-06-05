import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Avatar {
  id: string;
  avatar: string;
  color: string;
}

const avatars: Avatar[] = [
  { id: 'kursat', avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4', color: '#ffadad' },
  { id: 'emre', avatar: 'https://avatars.githubusercontent.com/u/41473129?v=4', color: '#ffd6a5' },
  { id: 'abdurrahim', avatar: 'https://avatars.githubusercontent.com/u/90318672?v=4', color: '#fdffb6' },
  { id: 'esra', avatar: 'https://avatars.githubusercontent.com/u/53093667?s=100&v=4', color: '#caffbf' },
  { id: 'bensu', avatar: 'https://avatars.githubusercontent.com/u/50342489?s=100&v=4', color: '#9bf6ff' },
  { id: 'burhan', avatar: 'https://avatars.githubusercontent.com/u/80754124?s=100&v=4', color: '#a0c4ff' },
  { id: 'abdurrahman', avatar: 'https://avatars.githubusercontent.com/u/15075759?s=100&v=4', color: '#bdb2ff' },
  { id: 'ahmet', avatar: 'https://avatars.githubusercontent.com/u/57258793?s=100&v=4', color: '#ffc6ff' },
];

interface Message {
  from: string;
  text: string;
}

const initialMessages: Record<string, Message[]> = {
  kursat: [{ from: 'kursat', text: "Why don't we go to the mall this weekend ?" }],
  emre: [{ from: 'emre', text: 'Send me our photos.' }],
  abdurrahim: [{ from: 'abdurrahim', text: 'Hey ! Send me the animation video please.' }],
  esra: [{ from: 'esra', text: 'I need a random voice.' }],
  bensu: [{ from: 'bensu', text: 'Send your location.' }],
  burhan: [{ from: 'burhan', text: 'Recommend me some songs.' }],
  abdurrahman: [{ from: 'abdurrahman', text: 'Where is the presentation file ?' }],
  ahmet: [{ from: 'ahmet', text: "Let's join the daily meeting." }],
};

const ChatConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(initialMessages[id ?? ''] || []);
  const [text, setText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0]);
  const [showAvatars, setShowAvatars] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: selectedAvatar.id, text }]);
    setText('');
  };

  const getAvatar = (id: string) => avatars.find((a) => a.id === id) || avatars[0];

  return (
    <div className="chat-container" style={{ paddingBottom: 80, position: 'relative' }}>
      <Link to="/chat" style={{ display: 'block', marginBottom: 8 }}>
        Back
      </Link>
      <div className="chat-messages">
        {messages.map((msg, idx) => {
          const av = getAvatar(msg.from);
          const me = msg.from === selectedAvatar.id;
          return (
            <div key={idx} className={`message-item ${me ? 'me' : ''}`}>
              {!me && <img className="message-avatar" src={av.avatar} alt={msg.from} />}
              <div className="message-bubble" style={{ backgroundColor: av.color }}>
                {msg.text}
              </div>
              {me && <img className="message-avatar" src={av.avatar} alt={msg.from} />}
            </div>
          );
        })}
      </div>
      <div className="message-input-container">
        <div style={{ position: 'relative' }}>
          <img
            src={selectedAvatar.avatar}
            className="selected-avatar"
            alt="selected avatar"
            onClick={() => setShowAvatars((s) => !s)}
          />
          {showAvatars && (
            <div className="avatar-list">
              {avatars.map((a) => (
                <img
                  key={a.id}
                  src={a.avatar}
                  alt={a.id}
                  onClick={() => {
                    setSelectedAvatar(a);
                    setShowAvatars(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type here..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatConversationPage;
