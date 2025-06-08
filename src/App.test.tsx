import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders go to chat button', () => {
  render(<App />);
  const btnElement = screen.getByRole('button', { name: /go to chat/i });
  expect(btnElement).toBeInTheDocument();
});
