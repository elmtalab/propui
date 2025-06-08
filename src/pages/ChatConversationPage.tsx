import React, { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
import TimerIcon from '@mui/icons-material/Timer';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from '@mui/material/CircularProgress';

// SpeedDial features moved to ChatInboxPage
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

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
  delay: number;

  replyTo?: number;
}

interface Conversation {
  id: string;
  startDateTime: Date;
  messages: Message[];
}

const initialMessages: Record<string, Message[]> = {
  kursat: [{ id: 1, from: 'kursat', text: "Why don't we go to the mall this weekend ?", delay: 0 }],
  emre: [{ id: 1, from: 'emre', text: 'Send me our photos.', delay: 0 }],
  abdurrahim: [{ id: 1, from: 'abdurrahim', text: 'Hey ! Send me the animation video please.', delay: 0 }],
  esra: [{ id: 1, from: 'esra', text: 'I need a random voice.', delay: 0 }],
  bensu: [{ id: 1, from: 'bensu', text: 'Send your location.', delay: 0 }],
  burhan: [{ id: 1, from: 'burhan', text: 'Recommend me some songs.', delay: 0 }],
  abdurrahman: [{ id: 1, from: 'abdurrahman', text: 'Where is the presentation file ?', delay: 0 }],
  ahmet: [{ id: 1, from: 'ahmet', text: "Let's join the daily meeting.", delay: 0 }],

};


const ChatConversationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const initialStart = new Date();
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: `conv-${Math.random().toString(36).slice(2, 10)}`,
      startDateTime: initialStart,
      messages: initialMessages[id ?? ''] || [],
    },
  ]);
  const [conversationIndex, setConversationIndex] = useState(0);
  const [transitionDir, setTransitionDir] = useState<'left' | 'right' | null>(null);


  const [text, setText] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar>(avatars[0]);
  const [showAvatars, setShowAvatars] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [swipeId, setSwipeId] = useState<number | null>(null);
  const [dragState, setDragState] = useState<{ id: number | null; dx: number }>(
    { id: null, dx: 0 }
  );
  const [delayMenuId, setDelayMenuId] = useState<number | null>(null);
  const [delayMenuPosition, setDelayMenuPosition] =
    useState<{ x: number; y: number } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('conversations');
    if (!stored) return;
    try {
      const groups = JSON.parse(stored);
      const g = groups.find((gr: any) => gr.groupId === id);
      if (g && g.conversations) {
        const convs: Conversation[] = g.conversations.map((c: any) => ({
          id: c.conversationId || c.id,
          startDateTime: new Date(c.createdAt || new Date()),
          messages: (c.messages || []).map((m: any, idx: number) => ({
            id: idx + 1,
            from: m.sender_id || m.from || selectedAvatar.id,
            text: m.text || m.message_content || '',
            delay: 0,
          })),
        }));
        if (convs.length) {
          setConversations(convs);
        }
      }
    } catch {
      /* ignore */
    }
  }, [id]);

  const skipScrollRef = useRef(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const ls = localStorage.getItem('conversations');
    const groups = ls ? JSON.parse(ls) : [];
    const idx = groups.findIndex((g: any) => g.groupId === id);
    const data = conversations.map((c) => ({
      conversationId: c.id,
      createdAt: c.startDateTime,
      messages: c.messages,
    }));
    if (idx === -1) {
      groups.push({ groupId: id, conversations: data });
    } else {
      groups[idx].conversations = data;
    }
    localStorage.setItem('conversations', JSON.stringify(groups));
  }, [conversations, id]);



  const currentConversation = conversations[conversationIndex];
  const messages = currentConversation.messages;
  const startDateTime = currentConversation.startDateTime;

  const updateMessages = (updater: (prev: Message[]) => Message[]) => {
    setConversations((prev) => {
      const next = [...prev];
      next[conversationIndex] = {
        ...next[conversationIndex],
        messages: updater(next[conversationIndex].messages),
      };
      return next;
    });
  };

  const updateStartDateTime = (dt: Date) => {
    setConversations((prev) => {
      const next = [...prev];
      next[conversationIndex] = { ...next[conversationIndex], startDateTime: dt };
      return next;
    });
  };

  const gestureRef = useRef({
    startX: 0,
    startY: 0,
    dragging: false,
    moved: false,
  });
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);



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
    updateMessages((prev) => prev.filter((m) => m.id !== id));
    setMenuId(null);
    setMenuPosition(null);
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard?.writeText(textToCopy).catch(() => {
      /* ignore */
    });
    setMenuId(null);
    setMenuPosition(null);
  };


const handleSend = () => {
  if (!text.trim()) return;
  updateMessages((prev) => {
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
        delay: 0,
        replyTo: replyTo?.id,
      },
    ];
  });
    setText('');
    setEditingId(null);
    setReplyTo(null);
    scrollToBottomIfNeeded();
    setInputFocused(true);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.focus();
    }
};

  const handleFocus = () => {
    const targetId = replyTo?.id ?? messages[messages.length - 1]?.id;
    scrollToMessage(targetId);
    setTimeout(scrollToBottomIfNeeded, 100);
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  const getAvatar = (id: string) => avatars.find((a) => a.id === id) || avatars[0];

  const handleSwipeReply = (msg: Message) => {
    setMenuId(null);
    setMenuPosition(null);
    setReplyTo(msg);

    setText('');
    setEditingId(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAddDelay = (id: number, minutes: number) => {
    skipScrollRef.current = true;
    updateMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, delay: m.delay + minutes } : m))
    );
    setDelayMenuId(null);
  };

  const handleResetDelay = (id: number) => {
    skipScrollRef.current = true;
    updateMessages((prev) => prev.map((m) => (m.id === id ? { ...m, delay: 0 } : m)));
    setDelayMenuId(null);
  };

  const handleSchedule = () => {
    setGenerating(true);
    const stored = localStorage.getItem('tg_init_data');
    const telegramId = stored ? JSON.parse(stored).user?.id : null;
    const conv = conversations[conversationIndex];
    const payload = {
      telegramId,
      groupId: id,
      messages: conv.messages.map((m) => ({ text: m.text })),
      type: 'Scheduled',
    };
    try {
      const ls = localStorage.getItem('conversations');
      const groups = ls ? JSON.parse(ls) : [];
      const idx = groups.findIndex((g: any) => g.groupId === id);
      const convData = {
        conversationId: conv.id,
        createdAt: conv.startDateTime,
        messages: conv.messages,
        type: 'Scheduled',
      };
      if (idx === -1) {
        groups.push({ groupId: id, conversations: [convData] });
      } else {
        groups[idx].conversations = [convData];
      }
      localStorage.setItem('conversations', JSON.stringify(groups));
    } catch {
      /* ignore */
    }
    fetch('https://prop-backend-worker.elmtalabx.workers.dev/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).finally(() => setGenerating(false));
  };

  const computeTimestamp = (index: number) => {
    let total = 0;
    for (let i = 1; i <= index; i++) {
      total += messages[i].delay;
    }
    return new Date(startDateTime.getTime() + total * 60000).toISOString();
  };

  const generateJSON = () => {
    const conversationsJson = conversations.map((conv) => {
      let cumulative = 0;
      const start = conv.startDateTime.getTime();
      const msgs = conv.messages.map((m, idx) => {
        if (idx > 0) {
          cumulative += m.delay;
        }
        const timestamp = new Date(start + cumulative * 60000).toISOString();
        const relative = idx === 0 ? 0 : m.delay * 60;

        return {
          message_id: `m-${m.id}`,
          sender_id: m.from,
          sender_name: m.from,
          message_content: m.text,
          message_type: 'text',
          timestamp,
          relative_time: relative,
          status: 'pending',
          metadata: {
            language: 'en',
          },
        };
      });


      return {
        conversation_id: conv.id,
        start_time: conv.startDateTime.toISOString(),
        initiated_by: conv.messages[0]?.from || selectedAvatar.id,
        topic: '',
        conversation_metadata: { active: true, tags: [] },
        messages: msgs,
      };
    });

    const memberSet = new Set(
      conversations.flatMap((c) => c.messages.map((m) => m.from))
    );
    const members = Array.from(memberSet).map((u) => ({
      telegram_user_id: u,
      telegram_user_name: u,
      role: 'member',
      status: 'active',
      joined_at: conversations[0].startDateTime.toISOString(),
    }));


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
          members,
          conversations: conversationsJson,

        },
      ],
      ai_users: [],
      audit_log: [],
    };
  };

const handleInputChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>
) => {
  setText(e.target.value);

  const target = e.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  const max = window.innerHeight * 0.2;
  target.style.height = Math.min(target.scrollHeight, max) + 'px';
};

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
    } else {
      scrollToBottomIfNeeded();
    }
  }, [conversations, conversationIndex]);

  useEffect(() => {
    if (transitionDir) {
      const t = setTimeout(() => setTransitionDir(null), 350);
      return () => clearTimeout(t);
    }
  }, [transitionDir]);


  useEffect(() => {
    if (replyTo) {
      scrollToMessage(replyTo.id);
    }
  }, [replyTo]);

  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [conversationIndex]);


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
        boxSizing: 'border-box',
        width: '100%',
        transform: 'none',
        transition: 'none',

      }}
      onClick={() => {
        setMenuId(null);
        setMenuPosition(null);
        setDelayMenuId(null);
        setDelayMenuPosition(null);
      }}
      
    >
      <div className="chat-header">
        <Link to="/chat" className="back-icon">←</Link>
        <img
          src={getAvatar(id ?? '').avatar}
          className="header-avatar"
          alt={id}
        />
        <span className="header-name">{id}</span>
        <DateTimePicker
          className="header-datetime"
          onChange={(d) => d && updateStartDateTime(d)}
          value={startDateTime}
        />
      </div>
      <div className="conversation-nav">
        <Pagination
          count={conversations.length}
          page={conversationIndex + 1}
          renderItem={(item) => {
            if (item.type === 'previous') {
              return (
                <PaginationItem
                  {...item}
                  slots={{ previous: ArrowBackIcon }}
                  onClick={() => {
                    setConversationIndex((i) => Math.max(0, i - 1));
                    setTransitionDir('right');
                  }}
                />
              );
            }
            if (item.type === 'next') {
              const isLast = conversationIndex === conversations.length - 1;
              return (
                <PaginationItem
                  {...item}
                  slots={{ next: isLast ? AddIcon : ArrowForwardIcon }}
                  disabled={false}
                  onClick={() => {
                    if (isLast) {
                      setConversations((prev) => [
                        ...prev,
                        {
                          id: `conv-${Math.random()
                            .toString(36)
                            .slice(2, 10)}`,
                          startDateTime: new Date(),
                          messages: [],
                        },
                      ]);
                      setConversationIndex(conversations.length);
                    } else {
                      setConversationIndex((i) => i + 1);
                    }
                    setTransitionDir('left');
                  }}
                />
              );
            }
            return (
              <PaginationItem
                {...item}
                onClick={() => {
                  if (item.page != null) {
                    const idx = item.page - 1;
                    if (idx !== conversationIndex) {
                      setTransitionDir(
                        idx > conversationIndex ? 'left' : 'right'
                      );
                      setConversationIndex(idx);
                    }
                  }
                }}
              />
            );
          }}
        />

      </div>
      <div className="instruction-text">
        You are creating messages. The AI will execute these messages.
      </div>
      <div
        className="start-time-inputs"
        style={{ display: 'flex', gap: 4, marginBottom: 8, alignItems: 'center' }}
      >
        <Button
          className="generate-btn schedule-btn"
          onClick={handleSchedule}
          disabled={generating}

        >
          {generating ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <>
              <AutoAwesomeIcon style={{ marginRight: 4 }} />
              Schedule
            </>
          )}
        </Button>
      </div>
      <div
        className={`chat-messages ${
          transitionDir ? `animate-${transitionDir}` : ''
        }`}
        ref={messagesRef}
      >
        {messages.map((msg, idx) => {
          const av = getAvatar(msg.from);
          const me = msg.from === selectedAvatar.id;
          const reply = msg.replyTo != null ? messages.find((m) => m.id === msg.replyTo) : null;
          return (
            <React.Fragment key={msg.id}>
              <div
                id={`msg-${msg.id}`}
                className={`message-item ${me ? 'me' : ''} ${swipeId === msg.id ? 'swipe' : ''} ${dragState.id === msg.id ? 'dragging' : ''}`}
                style={{ transform: dragState.id === msg.id ? `translateX(${dragState.dx}px)` : undefined }}
              >
              {idx > 0 && (
                <span
                  className={`delay-wrapper ${me ? 'left' : 'right'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = (
                      e.currentTarget as HTMLElement
                    ).getBoundingClientRect();
                    setDelayMenuPosition({ x: rect.right, y: rect.top - 40 });
                    setDelayMenuId(delayMenuId === msg.id ? null : msg.id);
                  }}
                >
                  <IconButton
                    className="delay-btn"
                    size="small"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <TimerIcon fontSize="inherit" />
                  </IconButton>
                  {delayMenuId === msg.id && (
                    <div
                      className="message-menu"
                      style={{
                        left: delayMenuPosition?.x,
                        top: delayMenuPosition?.y,
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => handleResetDelay(msg.id)}>Reset</button>
                      {[1, 2, 3, 5].map((m) => (
                        <button
                          key={m}
                          onClick={() => handleAddDelay(msg.id, m)}
                        >
                          +{m}m
                        </button>
                      ))}
                    </div>
                  )}
                </span>
              )}
              {!me && <img className="message-avatar" src={av.avatar} alt={msg.from} />}
              <div
                className="message-bubble"
                style={{ backgroundColor: av.color }}

                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  const g = gestureRef.current;
                  g.startX = e.clientX;
                  g.startY = e.clientY;
                  g.dragging = true;
                  g.moved = false;
                  setDragState({ id: msg.id, dx: 0 });


                }}
                onMouseMove={(e) => {
                  const g = gestureRef.current;
                  if (!g.dragging || dragState.id !== msg.id) return;
                  if (
                    Math.abs(e.clientX - g.startX) > 5 ||
                    Math.abs(e.clientY - g.startY) > 5
                  ) {
                    g.moved = true;
                  }
                  setDragState({ id: msg.id, dx: e.clientX - g.startX });
                }}
                onMouseUp={() => {
                  const g = gestureRef.current;

                  if (g.dragging && dragState.id === msg.id) {
                    if (dragState.dx > 60) {
                      handleSwipeReply(msg);
                      setSwipeId(msg.id);
                      setTimeout(() => setSwipeId(null), 300);
                    }
                  }
                  g.dragging = false;
                  g.moved = false;
                  setDragState({ id: null, dx: 0 });
                }}
                onMouseLeave={() => {
                  const g = gestureRef.current;

                  g.dragging = false;
                  g.moved = false;
                  setDragState({ id: null, dx: 0 });
                }}
                onTouchStart={(e) => {
                  const g = gestureRef.current;
                  g.startX = e.touches[0].clientX;
                  g.startY = e.touches[0].clientY;
                  g.dragging = true;
                  g.moved = false;
                  setDragState({ id: msg.id, dx: 0 });


                }}
                onTouchMove={(e) => {
                  const g = gestureRef.current;
                  if (!g.dragging || dragState.id !== msg.id) return;
                  if (
                    Math.abs(e.touches[0].clientX - g.startX) > 5 ||
                    Math.abs(e.touches[0].clientY - g.startY) > 5
                  ) {
                    g.moved = true;
                  }
                  setDragState({ id: msg.id, dx: e.touches[0].clientX - g.startX });
                }}
                onTouchEnd={(e) => {
                  const g = gestureRef.current;

                  const dx = e.changedTouches[0].clientX - g.startX;
                  const dy = e.changedTouches[0].clientY - g.startY;
                  if (dx > 50 && Math.abs(dy) < 30) {
                    handleSwipeReply(msg);
                    setSwipeId(msg.id);
                    setTimeout(() => setSwipeId(null), 300);
                  }
                  g.dragging = false;
                  g.moved = false;
                  setDragState({ id: null, dx: 0 });
                }}
                onClick={(e) => {
                  const g = gestureRef.current;
                  if (g.moved) {
                    g.moved = false;
                    return;
                  }
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setMenuPosition({ x: rect.right, y: rect.top - 40 });
                  setMenuId(msg.id);
                  navigator.vibrate?.(50);
                  e.stopPropagation();
                }}
              >
                {reply && <div className="reply-text">{reply.text}</div>}
                {msg.text}
                <div className="message-time">
                  {new Date(computeTimestamp(idx)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {menuId === msg.id && (
                  <div
                    className="message-menu"
                    style={{ left: menuPosition?.x, top: menuPosition?.y }}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        setMenuId(null);
                        setMenuPosition(null);
                        setText(msg.text);
                        setEditingId(msg.id);
                        setReplyTo(null);
                        setTimeout(() => inputRef.current?.focus(), 0);
                      }}
                    >
                      <EditIcon fontSize="small" /> Edit
                    </button>
                    <button onClick={() => handleSwipeReply(msg)}>
                      <ReplyIcon fontSize="small" /> Reply
                    </button>
                    <button onClick={() => handleCopy(msg.text)}>
                      <ContentCopyIcon fontSize="small" /> Copy
                    </button>
                    <button onClick={() => handleDelete(msg.id)}>
                      <DeleteIcon fontSize="small" /> Delete
                    </button>
                  </div>
                )}
              </div>
              {me && <img className="message-avatar" src={av.avatar} alt={msg.from} />}
              </div>

            </React.Fragment>
          );
        })}
      </div>
      {replyTo && (
        <div className="reply-preview-wrapper">
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
        </div>
      )}
      <div className={`message-input-container ${inputFocused ? 'focused' : ''}`}>
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
          {editingId !== null && (
            <div className="reply-preview">Editing message</div>
          )}
          <textarea
            ref={inputRef}
            value={text}
            rows={1}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Type here..."
            style={{ resize: 'none', overflow: 'hidden' }}
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
          onClick={handleSchedule}
          color="primary"
          aria-label="generate-ai"
        >
          <SmartToyIcon />
        </IconButton>

        <IconButton
          className="send-button"
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
