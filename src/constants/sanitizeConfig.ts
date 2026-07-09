export const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['div', 'span', 'button'],
  ALLOWED_ATTR: [
    'data-image-url',
    'data-file-text',
    'data-file-link',
    'data-file-box',
    'data-file-button',
    'fdprocessedid',
    'path',
    'class',
    'style',
    'contenteditable'
  ],
  FORBID_ATTR: ['onerror', 'onclick', 'onload'],
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
  SAFE_FOR_TEMPLATES: true,
};