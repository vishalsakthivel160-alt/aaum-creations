import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  AlertCircle,
  RotateCcw,
  Leaf,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import ChatMessage from './ChatMessage';
import QuickPrompts from './QuickPrompts';
import WhatsAppButton from './WhatsAppButton';
import businessKnowledge from '../data/businessKnowledge.json';

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome-0',
  role: 'assistant',
  content: `**வணக்கம்! Welcome to Aaum Creations.** 🌿

I am your customer support guide for authentic **Shadow-Dried Soursop Leaves** (Graviola / முள்சீத்தா இலைகள்).

📦 **Two Easy Ways to Order:**
1. **Buy on Flipkart**: Secure online checkout via our [Official Flipkart Store](https://dl.flipkart.com/s/dL!4cJuuuN).
2. **Direct Courier Order on WhatsApp**: Message us directly on WhatsApp (+91 70945 56516) for doorstep courier delivery across India!

Feel free to ask questions about our leaves, tea brewing, or ordering options. How can I assist you today?`,
  timestamp: Date.now(),
};

export default function ChatWidget({ isOpen, setIsOpen, initialMessagePrompt, onClearInitialPrompt }) {
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null); // { message, code, canRetry }
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatWindowRef = useRef(null);
  const openButtonRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus textarea when opened
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    }
  }, [isOpen, messages, isLoading]);

  // Handle external prompt injection (e.g. clicking "Ask AI about this" on a product card)
  useEffect(() => {
    if (initialMessagePrompt) {
      if (!isOpen) {
        setIsOpen(true);
      }
      handleSendMessage(initialMessagePrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialMessagePrompt]);

  // Handle Escape key to close widget
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        openButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!query || isLoading) return;

    if (query.length > 500) {
      setErrorState({
        message: 'Message is too long. Please limit your question to 500 characters.',
        code: 'LENGTH_EXCEEDED',
        canRetry: false,
      });
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setErrorState(null);
    setIsLoading(true);

    try {
      // Prepare payload with clean role and content
      const payloadMessages = newMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10) // keep last 10 messages for context
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      if (data.reply) {
        const assistantMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('Received empty response from support service.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setErrorState({
        message:
          err.message ||
          'Unable to reach support service. Please check your network or reach out on WhatsApp.',
        code: 'REQUEST_FAILED',
        canRetry: true,
        lastFailedQuery: query,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends the message; Shift+Enter creates a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setErrorState(null);
    setShowClearConfirm(false);
  };

  const handleRetry = () => {
    if (errorState?.lastFailedQuery) {
      handleSendMessage(errorState.lastFailedQuery);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          ref={openButtonRef}
          type="button"
          className="floating-chat-btn"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Open Aaum Creations customer support chat"
        >
          <div className="btn-icon-wrapper">
            <MessageSquare size={24} className="main-chat-icon" />
            <span className="online-ping" aria-hidden="true" />
          </div>
          <span className="floating-btn-label">
            <span className="btn-title">Customer Support</span>
            <span className="btn-subtitle">Ask Aaum Creations</span>
          </span>
        </button>
      )}

      {/* Chat Window Dialog */}
      {isOpen && (
        <section
          ref={chatWindowRef}
          className="chat-window-modal"
          role="dialog"
          aria-labelledby="chat-window-title"
          aria-modal="true"
        >
          {/* Header */}
          <header className="chat-header">
            <div className="header-brand">
              <div className="brand-leaf-icon" aria-hidden="true">
                <Leaf size={18} />
              </div>
              <div className="brand-text-block">
                <h2 id="chat-window-title" className="brand-title">
                  {businessKnowledge?.business?.name || 'Aaum Creations'}
                </h2>
                <div className="status-indicator">
                  <span className="status-dot" aria-hidden="true" />
                  <span className="status-label">AI Support • English & தமிழ்</span>
                </div>
              </div>
            </div>

            <div className="header-controls">
              <WhatsAppButton variant="header" className="header-whatsapp">
                WhatsApp
              </WhatsAppButton>

              <button
                type="button"
                className="header-icon-btn clear-btn"
                onClick={() => setShowClearConfirm(true)}
                title="Clear conversation history"
                aria-label="Clear chat"
              >
                <Trash2 size={16} />
              </button>

              <button
                type="button"
                className="header-icon-btn close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chat window"
                aria-label="Close support chat"
              >
                <X size={18} />
              </button>
            </div>
          </header>

          {/* Clear Chat Confirmation Modal */}
          {showClearConfirm && (
            <div className="clear-confirm-overlay" role="alertdialog" aria-modal="true">
              <div className="clear-confirm-box">
                <p>Clear the current conversation and start fresh?</p>
                <div className="confirm-actions">
                  <button
                    type="button"
                    className="confirm-cancel-btn"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="confirm-accept-btn"
                    onClick={handleClearChat}
                  >
                    Yes, Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Message List */}
          <div
            className="chat-body"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Quick Suggestions (Shown when only welcome message exists) */}
            {messages.length === 1 && !isLoading && (
              <QuickPrompts onSelectPrompt={(q) => handleSendMessage(q)} />
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="chat-loading-row" aria-live="polite">
                <div className="avatar-bot loading-avatar" aria-hidden="true">
                  <Leaf size={14} />
                </div>
                <div className="loading-bubble">
                  <span className="dot dot-1" />
                  <span className="dot dot-2" />
                  <span className="dot dot-3" />
                  <span className="sr-only">Aaum Support is typing a response...</span>
                </div>
              </div>
            )}

            {/* Error Message Box */}
            {errorState && (
              <div className="chat-error-banner" role="alert">
                <AlertCircle size={18} className="error-icon" />
                <div className="error-content">
                  <p className="error-text">{errorState.message}</p>
                  {errorState.canRetry && (
                    <button
                      type="button"
                      className="error-retry-btn"
                      onClick={handleRetry}
                    >
                      <RotateCcw size={13} />
                      <span>Retry question</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Help Footer / WhatsApp Courier Order Prompt */}
          <div className="chat-owner-prompt">
            <span>Direct Courier Order via WhatsApp:</span>
            <WhatsAppButton
              variant="pill"
              customMessage="Hello Aaum Creations! 🌿\nI would like to order authentic Shadow-Dried Soursop Leaves via direct Courier delivery.\n\n• Name: \n• Quantity (Packs): \n• Delivery Address: \n• Pincode: \n• Phone: \n\nPlease share payment details (UPI/GPay) to confirm my order!"
            >
              Order on WhatsApp
            </WhatsAppButton>
          </div>

          {/* Input Area */}
          <footer className="chat-input-area">
            <div className="input-box-wrapper">
              <label htmlFor="chat-user-input" className="sr-only">
                Type your question for Aaum Creations support
              </label>
              <textarea
                id="chat-user-input"
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Soursop Leaves, brewing tea, Flipkart link... (Enter to send)"
                maxLength={500}
                rows={2}
                disabled={isLoading}
                aria-describedby="chat-input-help"
              />

              <button
                type="button"
                className="chat-send-btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputText.trim()}
                title="Send message (Enter)"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>

            <div id="chat-input-help" className="input-helper-row">
              <span className="shortcut-hint">
                <strong>Enter</strong> to send • <strong>Shift+Enter</strong> for newline
              </span>
              <span className={`char-counter ${inputText.length > 450 ? 'near-limit' : ''}`}>
                {inputText.length} / 500
              </span>
            </div>
          </footer>
        </section>
      )}
    </>
  );
}
