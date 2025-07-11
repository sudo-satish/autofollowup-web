import { Followup } from '@/shared/types';
import redis from './redis';

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const proxyAddress = 'whatsapp:+919205644495';

// Save conversation.sid in the DB.
export const createConversation = async (friendlyName: string) => {
  const conversation = await client.conversations.v1.conversations.create({
    friendlyName,
  });
  return conversation;
};

/**
 * Generate the address for the phone number.
 * @param phoneNumber - The phone number to generate the address for.
 * @returns The address for the phone number.
 *
 * @example
 * generateAddress('+918130626713') // returns 'whatsapp:+918130626713'
 */
export const generateAddress = async (phoneNumber: string) => {
  return `whatsapp:${phoneNumber}`;
};

/**
 * Create a participant in the conversation.
 * @param conversationSid - The SID of the conversation.
 * @param address - The address of the participant.
 * @returns The participant.
 * @example
 * createParticipants({
 *   conversationSid: 'CH7824133457334cf489f61541694463dd',
 *   address: 'whatsapp:+918130626713',
 * })
 *
 * Save participant.sid in the DB
 */
export const createParticipants = async ({
  conversationSid,
  address,
}: {
  conversationSid: string;
  address: string;
}) => {
  return client.conversations.v1
    .conversations(conversationSid)
    .participants.create({
      'messagingBinding.address': address,
      'messagingBinding.proxyAddress': proxyAddress,
    });
};

// TODO: Find the conversation id by participant address
export const getConversationIdByParticipantAddress = async (
  address: string
) => {
  //   const conversation = await client.conversations.v1.conversations.list({
  //     'messagingBinding.address': address,
  //   });
  //   return conversation.find((c: any) => c.messagingBinding?.address === address);

  return {
    sid: 'CH0c923f55b8ec4457b4fc0c00a632ddfd',
  };
};

export const SYSTEM_CONTENT_SID_MAP = {
  initialMessage: {
    sid: 'HXceca2ce6ad7dabef41b2c9da7d945045',
    template: `Hey {{name}}! How you doing today?`,
  },
};
/**
 * Send a system message to the conversation.
 * @param conversationSid - The SID of the conversation.
 * @param message - The message to send.
 * @returns The message.
 * @example
 * sendSystemMessage({
 *   conversationSid: 'CH7824133457334cf489f61541694463dd',
 *   contentSid: SYSTEM_CONTENT_SID_MAP['gigger-welcome'],
 *   contentVariables: {
 *     '1': 'Ragini',
 *   },
 * })
 *
 * Save message.sid in the DB
 */
export const sendSystemMessage = async ({
  conversationSid,
  contentSid,
  contentVariables,
}: {
  conversationSid: string;
  contentSid: string;
  contentVariables: Record<string, string>;
}) => {
  return client.conversations.v1
    .conversations(conversationSid)
    .messages.create({
      author: 'whatsapp:+919205644495',
      contentSid: contentSid,
      contentVariables: JSON.stringify({ name: 'Satish' }),
      // 'messagingBinding.proxyAddress': proxyAddress,
      // author: 'system',
      // body: SYSTEM_CONTENT_SID_MAP.initialMessage.template.replace(
      //   '{{name}}',
      //   contentVariables.name
      // ),
      // ContentSid: contentSid,
      // ContentVariables: JSON.stringify(contentVariables),
    });
};

interface SendMessageProps {
  message: string;
  followup: Followup;
}

/**
 * Send a message to the conversation.
 * @param message - The message to send.
 * @param conversationSid - The SID of the conversation.
 * @returns The message.
 * @example
 * sendMessage({
 *   message: 'Hello, how are you?',
 *   conversationSid: 'CH7824133457334cf489f61541694463dd',
 * })
 *
 * Save message.sid in the DB
 */
export const sendMessage = async ({ message, followup }: SendMessageProps) => {
  if (message && followup) {
    const to = '918130626713@c.us';
    redis.publish(
      'whatsapp.send-message',
      JSON.stringify({
        to,
        message,
      })
    );
  }

  return null;
};
