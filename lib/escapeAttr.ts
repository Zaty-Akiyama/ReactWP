import { escapeHtml } from './escapeHtml.js';

export function escapeAttr(value: string): string {
  return escapeHtml(value);
}