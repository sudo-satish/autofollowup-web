const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

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
      'messagingBinding.proxyAddress': 'whatsapp:+14155238886', // TODO: Replace it with the proxy address
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
  'gigger-welcome': 'CH7824133457334cf489f61541694463dd',
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
      author: 'system',
      ContentSid: contentSid,
      ContentVariables: JSON.stringify(contentVariables),
    });
};

interface SendMessageProps {
  message: string;
  conversationSid: string;
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
export const sendMessage = async ({
  message,
  conversationSid,
}: SendMessageProps) => {
  console.log({ accountSid, authToken });
  return client.conversations.v1
    .conversations(conversationSid)
    .messages.create({ author: 'system', body: message });
};
