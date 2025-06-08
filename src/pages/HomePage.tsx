import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.svg';
import '../App.css';

interface TelegramInitData {
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  [key: string]: any;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [initData, setInitData] = useState<TelegramInitData | null>(null);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initDataUnsafe) {
      setInitData(tg.initDataUnsafe);
      try {
        localStorage.setItem('tg_init_data', JSON.stringify(tg.initDataUnsafe));
      } catch {
        // ignore write errors
      }
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {initData?.user && (
          <>
            <p>
              Logged in as {initData.user.first_name}{' '}
              {initData.user.last_name ?? ''}
              {initData.user.username ? ` (@${initData.user.username})` : ''}
            </p>
            <p>User ID: {initData.user.id}</p>
          </>
        )}
        {initData && (
          <pre
            style={{
              textAlign: 'left',
              background: '#282c34',
              padding: '1rem',
              maxWidth: 300,
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(initData, null, 2)}
          </pre>
        )}
        <button onClick={() => navigate('/chat')}>Go to Chat</button>
      </header>
    </div>
  );
};

export default HomePage;
