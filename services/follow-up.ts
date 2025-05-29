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

export const createFollowup = async (followup: {
  dateTime: Date;
  client: string;
  agent: string;
  context: string;
}) => {
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
  let conversation = await getConversationIdByParticipantAddress(address);

  if (!conversation) {
    conversation = await createConversation(
      `${agent.name} - ${userClient.name}`
    );
    await createParticipants({
      conversationSid: conversation.sid,
      address,
    });
  }

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

    console.log({ message });

    // TODO: replace it with message sent by the system
    const systemSentMessage = SYSTEM_CONTENT_SID_MAP['gigger-welcome'];

    return systemSentMessage;
  }

  throw new Error('Conversation not found');
};
