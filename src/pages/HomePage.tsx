import React, { useEffect, useState } from 'react';
import { useRawInitData } from '@telegram-apps/sdk-react';
import { useNavigate } from 'react-router-dom';
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
  const rawInitData = useRawInitData();

  useEffect(() => {
    let data: TelegramInitData | null = null;
    const tg = (window as any).Telegram?.WebApp;
    const str = tg?.initData;
    if (tg?.initDataUnsafe) {
      data = tg.initDataUnsafe;
    } else if (str) {
      try {
        const params = new URLSearchParams(str);
        const obj: Record<string, any> = {};
        params.forEach((v, k) => {
          obj[k] = v;
        });
        if (obj.user) {
          obj.user = JSON.parse(obj.user);
        }
        data = obj as TelegramInitData;

      } catch {
        /* ignore */
      }
    }
    if (!data) {
      const stored = localStorage.getItem('tg_init_data');
      if (stored) {
        try {
          data = JSON.parse(stored);
        } catch {
          /* ignore */
        }
      }
    }
    if (data) {
      setInitData(data);
      try {
        localStorage.setItem('tg_init_data', JSON.stringify(data));
      } catch {
        /* ignore */
      }
    }
  }, [rawInitData]);

  return (
    <div className="App">
      <header className="App-header">
        {initData?.user && (
          <>
            <p>
              {initData.user.first_name}{' '}
              {initData.user.last_name ?? ''}
              {initData.user.username ? ` (@${initData.user.username})` : ''}
            </p>
            <p>Telegram ID: {initData.user.id}</p>
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
