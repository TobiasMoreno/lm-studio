export const WHATSAPP_NUMBER = '3516501219';
export const WHATSAPP_BASE_URL = 'https://wa.me/5493516501219';

export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}?text=${encodedMessage}`;
}
