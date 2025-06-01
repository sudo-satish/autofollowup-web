import prisma from '@/lib/prisma';
import { getSystemPrompt } from './prompt';
import {
  generateFollowupMessages,
  invokeAgent,
  persistFollowupMessage,
} from './agent';
import {
  createConversation,
  createParticipants,
  generateAddress,
  getConversationIdByParticipantAddress,
  sendMessage,
  sendSystemMessage,
  SYSTEM_CONTENT_SID_MAP,
} from './twillio';
import { ForbiddenError } from '@/utils/errors';

const debounceTimers: Record<string, NodeJS.Timeout> = {};
// Delay before responding (in milliseconds)
const DEBOUNCE_DELAY = 3000;

export const createFollowup = async (followup: {
  dateTime: Date;
  client: string;
  agent: string;
  context: string;
}) => {
  const existingFollowup = await prisma.followup.findFirst({
    where: {
      userClientId: +followup.client,
    },
  });

  if (existingFollowup) {
    throw new ForbiddenError('Followup already exists');
  }

  const agent = await prisma.agent.findUniqueOrThrow({
    where: {
      id: +followup.agent,
    },
  });

  const newFollowup = await prisma.followup.create({
    data: {
      agentId: +followup.agent,
      userClientId: +followup.client,
      context: followup.context,
      followupDate: followup.dateTime,
      status: 'SCHEDULED',
      messages: {
        create: [
          {
            content: await getSystemPrompt(agent, followup.context),
            role: 'system',
            channel: 'WHATSAPP',
            contentType: 'TEXT',
            createdAt: new Date(),
          },
        ],
      },
    },
  });

  await createConversationParticipant(newFollowup.id);

  return newFollowup;
};

export const initateAgentConversation = async (followupId: number) => {
  const followup = await prisma.followup.findUniqueOrThrow({
    where: {
      id: followupId,
    },
  });

  const initialMessage = await sendSystemMessageToConversation(followupId);

  await persistFollowupMessage(followup, {
    content: initialMessage,
    role: 'assistant',
  });
  await persistFollowupMessage(followup, {
    content: 'Hey there!',
    role: 'user',
  });

  const messages = await generateFollowupMessages(followup);
  const message = await invokeAgent(messages);
  const textMessage = message.text;
  await persistFollowupMessage(followup, {
    content: textMessage,
    role: 'assistant',
  });

  await prisma.followup.update({
    where: { id: followupId },
    data: {
      status: 'IN_PROGRESS',
    },
  });

  if (textMessage && followup.conversationSid) {
    await sendMessage({
      message: textMessage,
      conversationSid: followup.conversationSid,
    });
  }
};
export const resetFollowup = async (followupId: number) => {
  const followup = await prisma.followup.findUniqueOrThrow({
    where: {
      id: followupId,
    },
  });

  await prisma.message.deleteMany({
    where: {
      followupId,
      role: {
        not: 'system',
      },
    },
  });

  const initialMessage = await sendSystemMessageToConversation(followupId);

  await persistFollowupMessage(followup, {
    content: initialMessage,
    role: 'assistant',
  });
  await persistFollowupMessage(followup, {
    content: 'Hey there!',
    role: 'user',
  });

  const messages = await generateFollowupMessages(followup);
  const message = await invokeAgent(messages);
  const textMessage = message.text;
  await persistFollowupMessage(followup, {
    content: textMessage,
    role: 'assistant',
  });

  await prisma.followup.update({
    where: { id: followupId },
    data: {
      status: 'IN_PROGRESS',
    },
  });

  if (textMessage && followup.conversationSid) {
    await sendMessage({
      message: textMessage,
      conversationSid: followup.conversationSid,
    });
  }
};

export const deleteFollowup = async (id: number) => {
  // Wrap in transaciton
  await prisma.$transaction(async (tx) => {
    await tx.message.deleteMany({
      where: {
        followupId: id,
      },
    });
    await tx.followup.delete({
      where: { id },
    });
  });

  return {
    success: true,
    message: 'Followup deleted successfully',
  };
};

export const startFollowup = async (followupId: number) => {
  const updatedFollowup = await prisma.followup.update({
    where: { id: followupId },
    data: {
      status: 'IN_PROGRESS',
    },
  });

  return updatedFollowup;
};

export const onUserMessage = async (
  followupId: number,
  userMessage: string
) => {
  const followup = await prisma.followup.findUniqueOrThrow({
    where: {
      id: followupId,
    },
  });

  await persistFollowupMessage(followup, {
    content: userMessage,
    role: 'user',
  });

  // TODO: This should via debounce and not be called on every message
  if (followup.isAutoMode && followup.conversationSid) {
    const conversationSid = followup.conversationSid;
    // TODO: This should be called via debounce and not be called on every message

    if (debounceTimers[conversationSid]) {
      clearTimeout(debounceTimers[conversationSid]);
    }

    // Set a new timer
    debounceTimers[conversationSid] = setTimeout(async () => {
      const messages = await generateFollowupMessages(followup);
      const message = await invokeAgent(messages);
      const textMessage = message.text;
      await persistFollowupMessage(followup, {
        content: textMessage,
        role: 'assistant',
      });
      if (textMessage && followup.conversationSid) {
        await sendMessage({
          message: textMessage,
          conversationSid: followup.conversationSid,
        });
      }

      // Clean up
      delete debounceTimers[conversationSid];
    }, DEBOUNCE_DELAY);
  }
};

export const getFollowupByConversationSid = async (conversationSid: string) => {
  const followup = await prisma.followup.findFirst({
    where: {
      conversationSid,
    },
  });

  return followup;
};

export const createConversationParticipant = async (followupId: number) => {
  console.log({ followupId });
  const followup = await prisma.followup.findUniqueOrThrow({
    where: {
      id: followupId,
    },
  });

  const agent = await prisma.agent.findUniqueOrThrow({
    where: {
      id: followup.agentId,
    },
  });

  const userClient = await prisma.userClient.findUniqueOrThrow({
    where: {
      id: followup.userClientId,
    },
  });

  const address = await generateAddress(
    `${userClient.countryCode}${userClient.phone}`
  );

  // Fetch conversation id by participant address
  // If not found create a new conversation
  const conversation = await createConversation(
    `${agent.name} - ${userClient.name}`
  );
  await createParticipants({
    conversationSid: conversation.sid,
    address,
  });

  await prisma.followup.update({
    where: { id: followupId },
    data: {
      conversationSid: conversation.sid,
    },
  });
};

export const sendSystemMessageToConversation = async (followupId: number) => {
  const followup = await prisma.followup.findUniqueOrThrow({
    where: {
      id: followupId,
    },
  });

  const userClient = await prisma.userClient.findUniqueOrThrow({
    where: {
      id: followup.userClientId,
    },
  });

  if (followup.conversationSid) {
    const message = await sendSystemMessage({
      conversationSid: followup.conversationSid,
      contentSid: SYSTEM_CONTENT_SID_MAP['gigger-welcome'],
      contentVariables: {
        '1': userClient.name,
      },
    });

    // TODO: replace it with message sent by the system
    const systemSentMessage = SYSTEM_CONTENT_SID_MAP['gigger-welcome'];
    return systemSentMessage;
  }

  throw new Error('Conversation not found');
};
