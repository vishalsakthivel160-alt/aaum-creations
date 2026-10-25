import React, { useState } from 'react';
import StoreShowcase from './components/StoreShowcase';
import ChatWidget from './components/ChatWidget';
import './App.css';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState(null);

  const handleAskAI = (promptText) => {
    setInitialPrompt(promptText);
    setIsChatOpen(true);
  };

  return (
    <div className="app-root">
      {/* Background Ecommerce Showcase */}
      <StoreShowcase onAskAI={handleAskAI} />

      {/* Floating Customer Support Chatbot Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        initialMessagePrompt={initialPrompt}
        onClearInitialPrompt={() => setInitialPrompt(null)}
      />
    </div>
  );
}
