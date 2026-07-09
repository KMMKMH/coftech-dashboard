import { HOOK } from '@component/constants/sanitizeHooks';
import { SANITIZE_CONFIG } from '@component/constants/sanitizeConfig';
import createDOMPurify from 'dompurify';

let DOMPurifyInstance: ReturnType<typeof createDOMPurify> | null = null;

if (typeof window !== 'undefined') {
  DOMPurifyInstance = createDOMPurify(window);

  DOMPurifyInstance.addHook('uponSanitizeAttribute', (node, data) => {
    if (HOOK.HOOK_ATTRS.includes(data.attrName)) {
      if (HOOK.DANGEROUS_URL_PATTERN.test(data.attrValue)) {
        data.keepAttr = false;
      }
    }
  });
}

export const sanitizeHTML = (dirty: string): string => {
  if (DOMPurifyInstance) {
    return DOMPurifyInstance.sanitize(dirty, SANITIZE_CONFIG);
  }

  const DOMPurifyStatic = require('dompurify');
  return DOMPurifyStatic.sanitize(dirty, SANITIZE_CONFIG);
};