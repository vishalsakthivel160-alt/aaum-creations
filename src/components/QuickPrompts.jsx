import { Sparkles, ShoppingBag, Coffee, HelpCircle, MessageCircle, Sun, Package } from 'lucide-react';

const SUGGESTIONS = [
  {
    label: 'Order via WhatsApp Courier',
    query: 'How can I place a direct order for Soursop Leaves on WhatsApp for doorstep courier delivery?',
    icon: Package,
    category: 'Ordering',
  },
  {
    label: 'Flipkart link for Soursop Leaves',
    query: 'Where can I buy your Soursop Leaves and what is the Flipkart listing link?',
    icon: ShoppingBag,
    category: 'Product',
  },
  {
    label: 'How to prepare Soursop herbal tea?',
    query: 'How should I prepare and brew tea using your shadow-dried Soursop leaves?',
    icon: Coffee,
    category: 'Preparation',
  },
  {
    label: 'What is shadow drying (நிழல் உலர்த்தல்)?',
    query: 'Why do you shadow-dry your Soursop leaves and what are the benefits of this process?',
    icon: Sun,
    category: 'Processing',
  },
  {
    label: 'வணக்கம்! தமிழ் உதவி (Tamil Support)',
    query: 'வணக்கம்! உங்களுடைய முள்சீத்தா இலைகள் பற்றி தமிழ்ல சொல்லுங்க.',
    icon: HelpCircle,
    category: 'Language',
  },
  {
    label: 'Bulk order & WhatsApp contact',
    query: 'How can I place a wholesale or bulk order of Soursop Leaves on WhatsApp?',
    icon: MessageCircle,
    category: 'Support',
  },
];

export default function QuickPrompts({ onSelectPrompt }) {
  return (
    <div className="quick-prompts-container" role="region" aria-label="Quick questions">
      <div className="quick-prompts-header">
        <Sparkles size={14} className="sparkle-icon" />
        <span>Suggested questions:</span>
      </div>
      <div className="quick-prompts-grid">
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              className="quick-prompt-chip"
              onClick={() => onSelectPrompt(item.query)}
              aria-label={`Ask question: ${item.label}`}
            >
              <Icon size={13} className="chip-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
