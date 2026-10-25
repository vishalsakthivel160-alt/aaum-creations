import React from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Safely format text containing simple markdown:
 * - Links: [Text](https://...) or raw URLs
 * - Bold: **text**
 * - Bullet lists: Lines starting with * or -
 * - Paragraphs and line breaks
 */
export function formatMessageText(text) {
  if (!text) return null;

  // Split into lines
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="chat-bullet-list">
          {currentList.map((item, idx) => (
            <li key={idx}>{parseInlineElements(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();

    // Check for bullet list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.slice(2));
      return;
    }

    // Flush any pending bullet list
    flushList();

    // Empty line represents paragraph break
    if (trimmed === '') {
      elements.push(<div key={`br-${lineIndex}`} className="chat-line-break" />);
      return;
    }

    elements.push(
      <p key={`p-${lineIndex}`} className="chat-paragraph">
        {parseInlineElements(line)}
      </p>
    );
  });

  flushList();
  return elements;
}

/**
 * Parses inline bold (**text**) and URLs / Markdown links [Label](url)
 */
function parseInlineElements(str) {
  // Regex to match markdown links [label](url) OR raw URLs https://...
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(str)) !== null) {
    // Add text before link
    if (match.index > lastIndex) {
      parts.push(...parseBold(str.substring(lastIndex, match.index)));
    }

    if (match[1] && match[2]) {
      // Markdown link [Label](url)
      const label = match[1];
      const url = match[2];
      const isFlipkart = url.includes('flipkart.com');

      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`chat-inline-link ${isFlipkart ? 'flipkart-link' : ''}`}
        >
          <span>{label}</span>
          <ExternalLink size={13} className="inline-icon" />
        </a>
      );
    } else if (match[3]) {
      // Raw URL
      const url = match[3];
      const isFlipkart = url.includes('flipkart.com');
      const label = isFlipkart ? 'View on Flipkart' : url;

      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`chat-inline-link ${isFlipkart ? 'flipkart-link' : ''}`}
        >
          <span>{label}</span>
          <ExternalLink size={13} className="inline-icon" />
        </a>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(...parseBold(str.substring(lastIndex)));
  }

  return parts;
}

/**
 * Parses bold segments: **bold text**
 */
function parseBold(str) {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={`bold-${match.index}`} className="chat-bold">
        {match[1]}
      </strong>
    );
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts;
}
