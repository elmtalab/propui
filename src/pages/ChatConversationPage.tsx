import React, { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

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
  timestamp: string;
  replyTo?: number;
}

const nowIso = new Date().toISOString();
const initialMessages: Record<string, Message[]> = {
  kursat: [{ id: 1, from: 'kursat', text: "Why don't we go to the mall this weekend ?", timestamp: nowIso }],
  emre: [{ id: 1, from: 'emre', text: 'Send me our photos.', timestamp: nowIso }],
  abdurrahim: [{ id: 1, from: 'abdurrahim', text: 'Hey ! Send me the animation video please.', timestamp: nowIso }],
  esra: [{ id: 1, from: 'esra', text: 'I need a random voice.', timestamp: nowIso }],
  bensu: [{ id: 1, from: 'bensu', text: 'Send your location.', timestamp: nowIso }],
  burhan: [{ id: 1, from: 'burhan', text: 'Recommend me some songs.', timestamp: nowIso }],
  abdurrahman: [{ id: 1, from: 'abdurrahman', text: 'Where is the presentation file ?', timestamp: nowIso }],
  ahmet: [{ id: 1, from: 'ahmet', text: "Let's join the daily meeting.", timestamp: nowIso }],

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
  const messagesRef = useRef<HTMLDivElement>(null);
  const conversationStartRef = useRef<string>(new Date().toISOString());
  const conversationIdRef = useRef<string>(`conv-${Math.random().toString(36).slice(2, 10)}`);
  const [jsonOpen, setJsonOpen] = useState(false);

  const scrollToMessage = (msgId: number | undefined) => {
    if (!msgId) return;
    const el = document.getElementById(`msg-${msgId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToBottomIfNeeded = () => {
    const container = messagesRef.current;
    if (container) {
      if (container.scrollHeight - container.clientHeight > 10) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      } else {
        container.scrollTop = 0;
      }
    }
  };

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
        return prev.map((m) => (m.id === editingId ? { ...m, text } : m));
      }
      const newId = prev.length ? prev[prev.length - 1].id + 1 : 1;
      return [
        ...prev,
        {
          id: newId,
          from: selectedAvatar.id,
          text,
          timestamp: new Date().toISOString(),
          replyTo: replyTo?.id,
        },
      ];
    });
    setText('');
    setEditingId(null);
    setReplyTo(null);
    scrollToBottomIfNeeded();
  };

  const handleFocus = () => {
    const targetId = replyTo?.id ?? messages[messages.length - 1]?.id;
    scrollToMessage(targetId);
    setTimeout(scrollToBottomIfNeeded, 100);

  };

  const getAvatar = (id: string) => avatars.find((a) => a.id === id) || avatars[0];

  const handleSwipeReply = (msg: Message) => {
    setReplyTo(msg);

    setText('');
    setEditingId(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const generateJSON = () => {
    const msgs = messages.map((m, idx) => {
      const prev = messages[idx - 1];
      const relative = prev
        ? Math.floor(
            (new Date(m.timestamp).getTime() -
              new Date(prev.timestamp).getTime()) /
              1000
          )
        : 0;
      return {
        message_id: `m-${m.id}`,
        sender_id: m.from,
        sender_name: m.from,
        message_content: m.text,
        message_type: 'text',
        timestamp: m.timestamp,
        relative_time: relative,
        status: 'pending',
        metadata: {
          language: 'en',
        },
      };
    });

    return {
      system_metadata: {
        version: '1.0.1',
        generated_at: new Date().toISOString(),
        timezone: 'UTC',
        description:
          'Ledger of AI-only outbound interactions inside Telegram groups',
      },
      groups: [
        {
          group_id: id,
          group_name: id,
          privacy_level: 'public',
          created_at: new Date().toISOString(),
          created_by: 123456789,
          group_description: '',
          members: [],
          conversations: [
            {
              conversation_id: conversationIdRef.current,
              start_time: conversationStartRef.current,
              initiated_by: selectedAvatar.id,
              topic: '',
              conversation_metadata: { active: true, tags: [] },
              messages: msgs,
            },
          ],
        },
      ],
      ai_users: [],
      audit_log: [],
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const targetId = replyTo?.id ?? messages[messages.length - 1]?.id;
    scrollToMessage(targetId);
  };

  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [messages]);

  useEffect(() => {
    if (replyTo) {
      scrollToMessage(replyTo.id);
    }
  }, [replyTo]);

  useEffect(() => {
    const handleResize = () => {
      setTimeout(scrollToBottomIfNeeded, 100);

    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div
      className="chat-container"
      style={{
        paddingBottom: 80,
        position: 'relative',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={() => setMenuId(null)}
    >
      <div className="chat-header">
        <Link to="/chat" className="back-icon">←</Link>
        <img
          src={getAvatar(id ?? '').avatar}
          className="header-avatar"
          alt={id}
        />
        <span className="header-name">{id}</span>
      </div>
      <div className="chat-messages" ref={messagesRef}>
        {messages.map((msg) => {
          const av = getAvatar(msg.from);
          const me = msg.from === selectedAvatar.id;
          const reply = msg.replyTo != null ? messages.find((m) => m.id === msg.replyTo) : null;
          let startX = 0;
          let startY = 0;
          let timer: NodeJS.Timeout;
          return (
            <div
              id={`msg-${msg.id}`}
              key={msg.id}
              className={`message-item ${me ? 'me' : ''} ${swipeId === msg.id ? 'swipe' : ''}`}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenuId(msg.id);
              }}

              onMouseDown={(e) => {
                if (e.button !== 0) return;
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
              <span>Replying to: {replyTo.text}</span>
              <span
                className="cancel-reply"
                role="button"
                aria-label="cancel reply"
                onClick={() => setReplyTo(null)}
              >
                ×
              </span>
            </div>
          )}
          {editingId !== null && (
            <div className="reply-preview">Editing message</div>
          )}
          <input
            ref={inputRef}
            value={text}
            onChange={handleInputChange}
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

        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setJsonOpen(true)}
          color="primary"
          aria-label="show-json"
        >
          <CodeIcon />
        </IconButton>

        <IconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSend}
          color="primary"
          aria-label="send"
        >
          <SendIcon />
        </IconButton>
      </div>
      <Dialog open={jsonOpen} onClose={() => setJsonOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Generated JSON</DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {JSON.stringify(generateJSON(), null, 2)}
          </pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJsonOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatConversationPage;
