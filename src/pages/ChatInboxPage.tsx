import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const ChatInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const chats = [
    {
      id: 'kursat',
      avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
      alt: 'kursat_avatar',
      title: 'Kursat',
      subtitle: "Why don't we go to the mall this weekend ?",
      date: new Date(),
      unread: 0,
    },
    {
      id: 'emre',
      avatar: 'https://avatars.githubusercontent.com/u/41473129?v=4',
      alt: 'emre_avatar',
      title: 'Emre',
      subtitle: 'Send me our photos.',
      date: new Date(),
      unread: 1,
    },
    {
      id: 'abdurrahim',
      avatar: 'https://avatars.githubusercontent.com/u/90318672?v=4',
      alt: 'abdurrahim_avatar',
      title: 'Abdurrahim',
      subtitle: 'Hey ! Send me the animation video please.',
      date: new Date(),
      unread: 1,
    },
    {
      id: 'esra',
      avatar: 'https://avatars.githubusercontent.com/u/53093667?s=100&v=4',
      alt: 'esra_avatar',
      title: 'Esra',
      subtitle: 'I need a random voice.',
      date: new Date(),
      unread: 1,
    },
    {
      id: 'bensu',
      avatar: 'https://avatars.githubusercontent.com/u/50342489?s=100&v=4',
      alt: 'bensu_avatar',
      title: 'Bensu',
      subtitle: 'Send your location.',
      date: new Date(),
      unread: 1,
    },
    {
      id: 'burhan',
      avatar: 'https://avatars.githubusercontent.com/u/80754124?s=100&v=4',
      alt: 'burhan_avatar',
      title: 'Burhan',
      subtitle: 'Recommend me some songs.',
      date: new Date(),
      unread: 1,
    },
    {
      id: 'abdurrahman',
      avatar: 'https://avatars.githubusercontent.com/u/15075759?s=100&v=4',
      alt: 'abdurrahman_avatar',
      title: 'Abdurrahman',
      subtitle: 'Where is the presentation file ?',
      date: new Date(),
      unread: 1,
    },
    {
      id: 'ahmet',
      avatar: 'https://avatars.githubusercontent.com/u/57258793?s=100&v=4',
      alt: 'ahmet_avatar',
      title: 'Ahmet',
      subtitle: "Let's join the daily meeting.",
      date: new Date(),
      unread: 1,
    },
  ];

  return (
    <div className="chat-container">
      <ChatList
        className="chat-list"
        dataSource={chats}
        onClick={(item: any) => {
          navigate(`/chat/${(item as any).id}`);
        }}
      />
    </div>
  );
};

export default ChatInboxPage;
