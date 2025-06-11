import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-chat-elements/dist/main.css';
import App from './App';
import { Toaster } from 'react-hot-toast';
import reportWebVitals from './reportWebVitals';

const tg = (window as any).Telegram?.WebApp;
const applyTheme = () => {
  if (!tg) return;
  document.body.classList.toggle('tg-dark', tg.colorScheme === 'dark');
  const params = tg.themeParams || {};
  Object.entries(params).forEach(([k, v]) => {
    document.body.style.setProperty(`--tg-theme-${k}`, String(v));
  });
};

applyTheme();
tg?.onEvent('themeChanged', applyTheme);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="bottom-center" />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
