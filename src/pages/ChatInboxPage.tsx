import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { ChatList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`chat-tabpanel-${index}`}
      aria-labelledby={`chat-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `chat-tab-${index}`,
    'aria-controls': `chat-tabpanel-${index}`,
  };
}

const ChatInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const executedChats = [
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

  const scheduledChats = executedChats.slice(0, 3);
  const draftChats = executedChats.slice(3);

  const [tabIndex, setTabIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );


  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };
    const viewport = (window as any).visualViewport;
    if (viewport) {
      viewport.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (viewport) {
        viewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);


  return (
    <div className="chat-container" style={{ height: viewportHeight }}>
      <div className="inbox-header">
        <h2>Chats</h2>
        <IconButton size="large" className="settings-icon">
          <SettingsIcon />
        </IconButton>
      </div>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          aria-label="chat tabs"
        >
          <Tab label="Executed" {...a11yProps(0)} />
          <Tab label="Scheduled" {...a11yProps(1)} />
          <Tab label="Draft" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <ChatList
          className="chat-list"
          dataSource={executedChats}
          onClick={(item: any) => {
            navigate(`/chat/${(item as any).id}`);
          }}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ChatList
          className="chat-list"
          dataSource={scheduledChats}
          onClick={(item: any) => {
            navigate(`/chat/${(item as any).id}`);
          }}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ChatList
          className="chat-list"
          dataSource={draftChats}
          onClick={(item: any) => {
            navigate(`/chat/${(item as any).id}`);
          }}
        />
      </TabPanel>
    </div>
  );
};

export default ChatInboxPage;
