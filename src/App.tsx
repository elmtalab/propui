import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatInboxPage from './pages/ChatInboxPage';
import ChatConversationPage from './pages/ChatConversationPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatInboxPage />} />
        <Route path="/chat/:id" element={<ChatConversationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
