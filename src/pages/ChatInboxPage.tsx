import React from 'react';
import { MessageList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const ChatInboxPage: React.FC = () => {
  const messages = [
    {
      position: 'left',
      type: 'text',
      title: 'Amir',
      subtitle: '2 minutes ago',
      date: new Date(),
      text: 'Hey, can you help me with something?',
      avatar: 'https://example.com/avatar1.jpg',
      unread: true,
    },
    {
      position: 'left',
      type: 'text',
      title: 'Support Bot',
      subtitle: '10 minutes ago',
      date: new Date(),
      text: 'Your request has been updated.',
      avatar: 'https://example.com/avatar2.jpg',
      unread: false,
    },
  ];

  return (
    <div style={{ padding: '10px' }} className="chat-container">
      <h2>Inbox</h2>
      <MessageList
        className="message-list"
        lockable={true}
        toBottomHeight={'100%'}
        dataSource={messages.map((msg) => ({
          ...msg,
          subtitle: msg.unread ? (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              1 new • {msg.subtitle}
            </span>
          ) : (
            msg.subtitle
          ),
        }))}
      />
    </div>
  );
};

export default ChatInboxPage;
