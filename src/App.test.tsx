import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders go to chat button', () => {
  render(<App />);
  const btnElement = screen.getByRole('button', { name: /go to chat/i });
  expect(btnElement).toBeInTheDocument();
});

test('shows user id when telegram data available', () => {
  (window as any).Telegram = {
    WebApp: { initDataUnsafe: { user: { id: 42, first_name: 'Foo' } } },
  };
  render(<App />);
  expect(screen.getByText(/telegram id:\s*42/i)).toBeInTheDocument();
  delete (window as any).Telegram;

});
