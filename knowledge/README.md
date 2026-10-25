# Aaum Creations — Business Knowledge Guide

This folder contains the official knowledge base that powers your AI Customer Support Chatbot.

## How to Edit Product & Business Information

You can easily update products, prices, descriptions, and contact info without touching any backend or frontend code!

1. Open `src/data/businessKnowledge.json` (and `knowledge/businessKnowledge.json`).
2. Make your edits in standard JSON format:
   - **WhatsApp Number**: `"whatsappNumber": "+917094556516"` (India country code `91` followed by `7094556516`).
   - **Products**: Add or update product details, pack descriptions, and verified marketplace links.
   - **Guardrails**: Ensure strictly that health/medical claims remain prohibited and unverified order confirmations are never fabricated.
   - **FAQs**: Add new common customer questions and answers to the `"frequentlyAskedQuestions"` array.
3. Save the file. The AI chatbot will automatically use your business knowledge!

## Important Business Rules Built Into the AI

1. **Soursop Leaves**: No unsupported disease cure or medical claims are ever permitted.
2. **Authentic Shadow-Dried**: 100% pure Soursop Leaves (Graviola / முள்சீத்தா இலைகள்) for traditional herbal infusions.
3. **No Made-Up Data**: The AI will never invent random prices, false discounts, or fake delivery tracking numbers. It will always offer to connect the customer with you on WhatsApp for customized answers.
4. **Tamil & English Bilingualism**: The AI responds naturally in Tamil or English based on how the customer chats.
