export const WHATSAPP_NUMBER = '3512552929';
export const WHATSAPP_BASE_URL = 'https://wa.me/5493512552929';

export function getWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}?text=${encodedMessage}`;
}
