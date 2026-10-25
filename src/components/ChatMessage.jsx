import React from 'react';
import { formatMessageText } from '../utils/formatters';
import { Leaf, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const timeStr = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      className={`chat-message-row ${isUser ? 'user-row' : 'assistant-row'}`}
      role="article"
      aria-label={`${isUser ? 'Customer' : 'Aaum Support'} message`}
    >
      <div className="message-avatar" aria-hidden="true">
        {isUser ? (
          <div className="avatar-user">
            <User size={15} />
          </div>
        ) : (
          <div className="avatar-bot">
            <Leaf size={15} />
          </div>
        )}
      </div>

      <div className="message-bubble-wrapper">
        <div className="message-meta">
          <span className="sender-name">{isUser ? 'You' : 'Aaum Support'}</span>
          {timeStr && <span className="message-timestamp">{timeStr}</span>}
        </div>

        <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
          {formatMessageText(message.content)}
        </div>
      </div>
    </div>
  );
}
