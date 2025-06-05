import React, { useEffect, useRef, useState } from 'react';

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
 id: number;
  from: string;
  text: string;
  replyTo?: number;
}

const initialMessages: Record<string, Message[]> = {
  kursat: [{ id: 1, from: 'kursat', text: "Why don't we go to the mall this weekend ?" }],
  emre: [{ id: 1, from: 'emre', text: 'Send me our photos.' }],
  abdurrahim: [{ id: 1, from: 'abdurrahim', text: 'Hey ! Send me the animation video please.' }],
  esra: [{ id: 1, from: 'esra', text: 'I need a random voice.' }],
  bensu: [{ id: 1, from: 'bensu', text: 'Send your location.' }],
  burhan: [{ id: 1, from: 'burhan', text: 'Recommend me some songs.' }],
  abdurrahman: [{ id: 1, from: 'abdurrahman', text: 'Where is the presentation file ?' }],
  ahmet: [{ id: 1, from: 'ahmet', text: "Let's join the daily meeting." }],

};

const ChatConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(initialMessages[id ?? ''] || []);
  const [text, setText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0]);
  const [showAvatars, setShowAvatars] = useState(false);
 const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [swipeId, setSwipeId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard?.writeText(textToCopy).catch(() => {
      /* ignore */
    });
    setMenuId(null);
  };


  const handleSend = () => {
    if (!text.trim()) return;
    setMessages((prev) => {
      if (editingId !== null) {
        return prev.map((m) =>
          m.id === editingId ? { ...m, text } : m
        );
      }
      const newId = prev.length ? prev[prev.length - 1].id + 1 : 1;
      return [
        ...prev,
        { id: newId, from: selectedAvatar.id, text, replyTo: replyTo?.id },
      ];
    });
    setText('');
    setEditingId(null);
    setReplyTo(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleFocus = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAvatar = (id: string) => avatars.find((a) => a.id === id) || avatars[0];

  const handleSwipeReply = (msg: Message) => {
    setReplyTo(msg);

    setText('');
    setEditingId(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  return (
    <div
      className="chat-container"
      style={{ paddingBottom: 80, position: 'relative' }}
      onClick={() => setMenuId(null)}
    >
      <Link to="/chat" style={{ display: 'block', marginBottom: 8 }}>
        Back
      </Link>
      <div className="chat-messages">
        {messages.map((msg) => {
          const av = getAvatar(msg.from);
          const me = msg.from === selectedAvatar.id;
          const reply = msg.replyTo != null ? messages.find((m) => m.id === msg.replyTo) : null;
          let startX = 0;
          let startY = 0;
          let timer: NodeJS.Timeout;
          return (
            <div
              key={msg.id}
              className={`message-item ${me ? 'me' : ''} ${swipeId === msg.id ? 'swipe' : ''}`}
              onContextMenu={(e) => e.preventDefault()}

              onMouseDown={() => {
                timer = setTimeout(() => setMenuId(msg.id), 600);
              }}
              onMouseUp={() => clearTimeout(timer)}
              onMouseLeave={() => clearTimeout(timer)}
              onTouchStart={(e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                timer = setTimeout(() => setMenuId(msg.id), 600);
              }}
              onTouchEnd={(e) => {
                clearTimeout(timer);
                const dx = e.changedTouches[0].clientX - startX;
                const dy = e.changedTouches[0].clientY - startY;
                if (dx > 50 && Math.abs(dy) < 30) {
                  handleSwipeReply(msg);
                  setSwipeId(msg.id);
                  setTimeout(() => setSwipeId(null), 300);
                }
              }}
            >
              {!me && <img className="message-avatar" src={av.avatar} alt={msg.from} />}
              <div className="message-bubble" style={{ backgroundColor: av.color }}>
                {reply && <div className="reply-text">{reply.text}</div>}
                {msg.text}
                {menuId === msg.id && (
                  <div className="message-menu">
                    <button
                      onClick={() => {
                        setMenuId(null);
                        setText(msg.text);
                        setEditingId(msg.id);
                        setReplyTo(null);
                        setTimeout(() => inputRef.current?.focus(), 0);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleSwipeReply(msg)}>Reply</button>
                    <button onClick={() => handleCopy(msg.text)}>Copy</button>
                    <button onClick={() => handleDelete(msg.id)}>Delete</button>

                  </div>
                )}

              </div>
              {me && <img className="message-avatar" src={av.avatar} alt={msg.from} />}
            </div>
          );
        })}
        <div ref={endRef} />
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
       <div style={{ flex: 1 }}>
          {replyTo && (
            <div className="reply-preview">
              Replying to: {replyTo.text}
            </div>
          )}
          {editingId !== null && (
            <div className="reply-preview">Editing message</div>
          )}
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}

            onFocus={handleFocus}
            placeholder="Type here..."
          />
        </div>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatConversationPage;
