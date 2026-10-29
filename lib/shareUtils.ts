import { EventPlan } from '@/types';
import { formatDate, formatINR } from './formatters';

/**
 * Compresses an EventPlan into a URL-safe Base64 string using native browser compression
 */
export async function encodePlanToShareToken(plan: EventPlan): Promise<string> {
  const jsonStr = JSON.stringify(plan);
  
  if (typeof window !== 'undefined' && 'CompressionStream' in window) {
    try {
      const stream = new Blob([jsonStr]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const buffer = await new Response(compressedStream).arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      let binary = '';
      const len = uint8.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      return 'gz_' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch {
      // fallback to plain base64
    }
  }

  // Fallback to URL-safe base64
  return 'b64_' + encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
}

/**
 * Decodes a share token back into an EventPlan object
 */
export async function decodeShareTokenToPlan(token: string): Promise<EventPlan | null> {
  try {
    if (token.startsWith('gz_')) {
      const base64 = token.slice(3).replace(/-/g, '+').replace(/_/g, '/');
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const stream = new Blob([bytes]).stream();
      const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
      const text = await new Response(decompressedStream).text();
      return JSON.parse(text) as EventPlan;
    } else if (token.startsWith('b64_')) {
      const raw = token.slice(4);
      const decoded = decodeURIComponent(escape(atob(decodeURIComponent(raw))));
      return JSON.parse(decoded) as EventPlan;
    } else {
      // Legacy or direct base64
      const decoded = decodeURIComponent(escape(atob(decodeURIComponent(token))));
      return JSON.parse(decoded) as EventPlan;
    }
  } catch (err) {
    console.error('Failed to decode shared plan token:', err);
    return null;
  }
}

export interface WhatsAppInviteOptions {
  plan: EventPlan;
  guestName?: string;
  guestCount?: number;
  segment: 'vip' | 'general' | 'out_of_town' | 'vendor';
  passUrl?: string;
}

/**
 * Generates rich, pre-filled WhatsApp invite copy based on guest tier
 */
export function generateWhatsAppInviteCopy({
  plan,
  guestName = 'Respected Family / Guest',
  guestCount = 2,
  segment,
  passUrl,
}: WhatsAppInviteOptions): { text: string; waLink: string } {
  const eventName = plan.formData.eventName;
  const eventDate = formatDate(plan.formData.eventDate);
  const venue = plan.venueDetails?.name || plan.formData.venueName || 'Celebration Venue';
  const address = plan.venueDetails?.address || `${plan.formData.locality || ''}, ${plan.formData.city}`;
  const muhurat = plan.muhuratDetails?.shubhMuhurat || '05:00 PM onwards';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue} ${plan.formData.city}`)}`;
  const passLink = passUrl || (typeof window !== 'undefined' ? `${window.location.origin}/?view=pass&planId=${plan.id}` : '');

  let message = '';

  if (segment === 'vip') {
    message = `🌟 *VIP INVITATION & CELEBRATION HONOUR* 🌟\n\n` +
      `Dearest *${guestName}*,\n` +
      `With great joy and cultural reverence, our family warmly cordially invites you & your family (${guestCount} Passes reserved) to celebrate:\n\n` +
      `✨ *${eventName}* ✨\n\n` +
      `📅 *Date:* ${eventDate}\n` +
      `🕉️ *Shubh Muhurat / Rituals:* ${muhurat}\n` +
      `🏛️ *Venue:* ${venue}\n` +
      `📍 *Location:* ${address}\n` +
      `🗺️ *Google Maps:* ${mapsUrl}\n\n` +
      `👑 *Your VIP Access Pass:* You hold All-Access Family privileges (Special reserved seating & traditional royal feast).\n` +
      `🎟️ *Digital Gate Pass & QR Badge:* ${passLink}\n\n` +
      `_Kindly RSVP by replying with "1" to confirm attendance, and let us know any dietary preferences (Jain/Pure Veg)._\n\n` +
      `With warm regards,\n` +
      `*The Host Family*`;
  } else if (segment === 'out_of_town') {
    message = `✈️ *OUT-OF-TOWN GUEST LOGISTICS & INVITATION* 🏨\n\n` +
      `Dear *${guestName}*,\n` +
      `We cannot wait to welcome you to ${plan.formData.city} for *${eventName}*!\n\n` +
      `📅 *Celebration Date:* ${eventDate}\n` +
      `🏛️ *Venue:* ${venue}\n` +
      `⏰ *Arrival / Muhurat:* ${muhurat}\n` +
      `🗺️ *Venue Directions:* ${mapsUrl}\n\n` +
      `🚗 *Hospitality & Logistics:* Shuttle and local coordinate support are stationed at airport/station. Please share your arrival time with the coordination desk.\n` +
      `🎟️ *Your Digital Gate & Room Pass:* ${passLink}\n\n` +
      `Please reply with your travel itinerary so we can arrange your warm welcome!`;
  } else if (segment === 'vendor') {
    message = `📋 *OPERATIONS & CALL TIME NOTICE* ⏱️\n\n` +
      `Attention: *${guestName}* (Vendor / Partner Team)\n` +
      `Event: *${eventName}*\n` +
      `📅 *Date:* ${eventDate}\n` +
      `🏛️ *Venue:* ${venue}\n` +
      `⏰ *Sound / Setup Check:* 2 Hours prior to ${muhurat}\n` +
      `🔊 *Civic Compliance:* Adherence to 10:00 PM sound curfew and loading clearance.\n` +
      `🎟️ *Vendor Gate Pass & Logistics QR:* ${passLink}\n\n` +
      `Please report to the floor coordinator upon arrival.`;
  } else {
    // General
    message = `🎉 *CELEBRATION INVITATION* 🎉\n\n` +
      `Dear *${guestName}*,\n` +
      `You are warmly invited to celebrate with us on the auspicious occasion of:\n\n` +
      `✨ *${eventName}* ✨\n\n` +
      `📅 *Date:* ${eventDate}\n` +
      `⏰ *Timing:* ${muhurat}\n` +
      `🏛️ *Venue:* ${venue}, ${plan.formData.city}\n` +
      `📍 *Location Map:* ${mapsUrl}\n\n` +
      `🎟️ *Your Digital Entry Pass & QR:* ${passLink}\n\n` +
      `_Please confirm your presence by replying to this message!_\n` +
      `Looking forward to having you with us!`;
  }

  const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  return { text: message, waLink };
}

