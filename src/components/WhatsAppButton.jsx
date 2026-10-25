import React from 'react';
import { MessageCircle } from 'lucide-react';
import businessKnowledge from '../data/businessKnowledge.json';

export default function WhatsAppButton({
  customMessage,
  className = '',
  variant = 'default', // 'default', 'compact', 'pill', 'header'
  children,
}) {
  // Configurable phone number: Read from VITE_WHATSAPP_PHONE_NUMBER if present, else fallback to business knowledge
  const rawNumber =
    import.meta.env.VITE_WHATSAPP_PHONE_NUMBER ||
    businessKnowledge?.business?.contact?.whatsappNumber ||
    '917094556516';

  // Sanitize number: strip +, spaces, hyphens for wa.me URL
  const cleanPhone = String(rawNumber).replace(/[^\d]/g, '');

  const defaultMsg =
    import.meta.env.VITE_WHATSAPP_MESSAGE ||
    businessKnowledge?.business?.contact?.whatsappDefaultMessage ||
    'Hello Aaum Creations, I would like to inquire about your products.';

  const messageToSend = customMessage || defaultMsg;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageToSend)}`;

  const buttonClasses = `whatsapp-btn variant-${variant} ${className}`.trim();

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses}
      aria-label={`Chat directly with Aaum Creations owner on WhatsApp at +${cleanPhone}`}
      title="Open WhatsApp chat with owner"
    >
      <MessageCircle size={variant === 'header' || variant === 'compact' ? 16 : 18} className="whatsapp-icon" />
      <span>{children || 'WhatsApp Support'}</span>
    </a>
  );
}
