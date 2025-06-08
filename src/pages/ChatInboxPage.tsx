import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { ChatList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


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

const groupCategories: Record<string, string[]> = {
  Sports: ['Football Fans', 'Basketball Lovers'],
  Movies: ['Sci-Fi Lovers', 'Comedy Club'],
};

const ChatInboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    let tgId: number | null = null;
    const tgStr = localStorage.getItem('tg_init_data');
    if (tgStr) {
      try {
        tgId = JSON.parse(tgStr).user?.id ?? null;
      } catch {
        // ignore
      }
    }
    if (!tgId) {
      const tg = (window as any).Telegram?.WebApp;
      tgId = tg?.initDataUnsafe?.user?.id ?? null;
    }

    if (!tgId) return;
    fetch(
      `https://prop-backend-worker.elmtalabx.workers.dev/api/user-conversations?telegramId=${tgId}`
    )
      .then((r) => r.json())
      .then((data) => {
        const g = data.groups || [];
        setGroups(g);
        localStorage.setItem('conversations', JSON.stringify(g));
      })
      .catch(() => {
        const stored = localStorage.getItem('conversations');
        if (stored) setGroups(JSON.parse(stored));
      });
  }, []);

  const executedChats = groups.map((g) => ({
    id: g.groupId,
    avatar: '',
    alt: g.groupId,
    title: g.groupId,
    subtitle:
      g.conversations?.[g.conversations.length - 1]?.messages?.slice(-1)[0]?.text ||
      '',
    date: new Date(),
    unread: 0,
  }));

  const scheduledChats = executedChats;
  const draftChats: typeof executedChats = [];

  const [tabIndex, setTabIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState({
    displayName: '',
    occupation: '',
    assistantTraits: [] as string[],
    extraContext: '',
  });

  const [traitInput, setTraitInput] = useState('');

  const handleToggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handlePromptChange = (
    field: 'displayName' | 'occupation' | 'extraContext',
    value: string
  ) => {
    setSystemPrompt((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTrait = () => {
    const t = traitInput.trim();
    if (!t) return;
    setSystemPrompt((prev) => ({
      ...prev,
      assistantTraits: Array.from(new Set([...prev.assistantTraits, t])),
    }));
    setTraitInput('');
  };

  const handleDeleteTrait = (trait: string) => {
    setSystemPrompt((prev) => ({
      ...prev,
      assistantTraits: prev.assistantTraits.filter((t) => t !== trait),
    }));
  };


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

      <SpeedDial
        ariaLabel="chat actions"
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
      >
        <SpeedDialAction
          icon={<GroupAddIcon />}
          tooltipTitle="Add Group"
          onClick={() => {
            setSpeedDialOpen(false);
            setGroupDialogOpen(true);
          }}
        />
        <SpeedDialAction
          icon={<SettingsSuggestIcon />}
          tooltipTitle="System Prompt"
          onClick={() => {
            setSpeedDialOpen(false);
            setPromptDialogOpen(true);
          }}
        />
        <SpeedDialAction
          icon={<SmartToyIcon />}
          tooltipTitle="Auto Chat"
          onClick={() => {
            setSpeedDialOpen(false);
            if (!systemPrompt.displayName && !systemPrompt.occupation) {
              setPromptDialogOpen(true);
            } else {
              alert(
                `Generating conversations for ${selectedGroups.join(', ') ||
                  'selected groups'}...`
              );
            }
          }}
        />
      </SpeedDial>

      <Dialog open={groupDialogOpen} onClose={() => setGroupDialogOpen(false)} fullWidth>
        <DialogTitle>Select Groups</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            placeholder="Search groups"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          {Object.entries(groupCategories).map(([cat, groups]) => (
            <div key={cat} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 'bold' }}>{cat}</div>
              {groups
                .filter((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((g) => (
                  <FormControlLabel
                    key={g}
                    control={
                      <Checkbox
                        checked={selectedGroups.includes(g)}
                        onChange={() => handleToggleGroup(g)}
                      />
                    }
                    label={g}
                  />
                ))}
            </div>
          ))}
          {searchTerm &&
            !Object.values(groupCategories).flat().some((g) => g === searchTerm) && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedGroups((prev) => [...prev, searchTerm]);
                  setSearchTerm('');
                }}
              >
                Add "{searchTerm}" as group
              </Button>
            )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button
            startIcon={<SmartToyIcon />}
            onClick={() => alert('AI will select groups soon...')}
          >
            Choose groups by AI
          </Button>
          <Button onClick={() => setGroupDialogOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={promptDialogOpen}
        onClose={() => setPromptDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
      <DialogTitle>System Prompt</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, marginBottom: 4 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
              What should Penemue call you?
            </div>

            <TextField
              label="Nickname"
              value={systemPrompt.displayName}
              onChange={(e) => handlePromptChange('displayName', e.target.value)}
              fullWidth
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, marginBottom: 4 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
              What do you do?
            </div>

            <TextField
              label="Occupation"
              value={systemPrompt.occupation}
              onChange={(e) => handlePromptChange('occupation', e.target.value)}
              fullWidth
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, marginBottom: 4 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
              What traits should Penemue have?
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
              {systemPrompt.assistantTraits.map((t) => (
                <Chip key={t} label={t} onDelete={() => handleDeleteTrait(t)} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <TextField
                placeholder="Describe or select traits"
                value={traitInput}
                onChange={(e) => setTraitInput(e.target.value)}
                fullWidth
                size="small"
              />
              <IconButton onClick={handleAddTrait} color="primary">
                <AddIcon />
              </IconButton>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, marginBottom: 4 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Anything else Penemue should know about you?
            </div>

            <TextField
              label="Extra context"
              value={systemPrompt.extraContext}
              onChange={(e) => handlePromptChange('extraContext', e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromptDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatInboxPage;
