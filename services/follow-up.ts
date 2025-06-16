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
  sendMessage,
  sendSystemMessage,
  SYSTEM_CONTENT_SID_MAP,
} from './twillio';
import { ForbiddenError } from '@/utils/errors';
import redis from './redis';

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
      clientId: +followup.client,
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
      clientId: +followup.client,
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

  // const messages = await generateFollowupMessages(followup);
  // const message = await invokeAgent(messages);
  // const textMessage = message.text;
  // await persistFollowupMessage(followup, {
  //   content: textMessage,
  //   role: 'assistant',
  // });

  // await prisma.followup.update({
  //   where: { id: followupId },
  //   data: {
  //     status: 'IN_PROGRESS',
  //   },
  // });

  // if (textMessage && followup.conversationSid) {
  //   await sendMessage({
  //     message: textMessage,
  //     conversationSid: followup.conversationSid,
  //   });
  // }
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

  // const initialMessage = await sendSystemMessageToConversation(followupId);

  const client = await prisma.client.findUniqueOrThrow({
    where: {
      id: followup.clientId,
    },
  });

  const initialMessage = `Hello ${client.name}, how can I help you today?`;

  // await persistFollowupMessage(followup, {
  //   content: initialMessage,
  //   role: 'assistant',
  // });

  redis.publish(
    'whatsapp.send-message',
    JSON.stringify({
      companyId: client.companyId,
      message: initialMessage,
      to: `${client.countryCode.replace('+', '')}${client.phone}@c.us`,
    })
  );

  // const messages = await generateFollowupMessages(followup);
  // const message = await invokeAgent(messages);
  // const textMessage = message.text;
  // await persistFollowupMessage(followup, {
  //   content: textMessage,
  //   role: 'assistant',
  // });

  // await prisma.followup.update({
  //   where: { id: followupId },
  //   data: {
  //     status: 'IN_PROGRESS',
  //   },
  // });

  // if (textMessage && followup.conversationSid) {
  //   await sendMessage({
  //     message: textMessage,
  //     conversationSid: followup.conversationSid,
  //   });
  // }
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

  const client = await prisma.client.findUniqueOrThrow({
    where: {
      id: followup.clientId,
    },
  });

  const address = await generateAddress(`${client.countryCode}${client.phone}`);

  // Fetch conversation id by participant address
  // If not found create a new conversation
  // CH0c923f55b8ec4457b4fc0c00a632ddfd
  const conversation = await createConversation(
    `${agent.name} - ${client.name}`
  );
  await createParticipants({
    conversationSid: conversation.sid,
    address,
  });

  const conversationSid = conversation.sid;
  // const conversationSid = 'CH0c923f55b8ec4457b4fc0c00a632ddfd';

  await prisma.followup.update({
    where: { id: followupId },
    data: {
      conversationSid: conversationSid,
    },
  });
};

export const sendSystemMessageToConversation = async (followupId: number) => {
  const followup = await prisma.followup.findUniqueOrThrow({
    where: {
      id: followupId,
    },
  });

  const client = await prisma.client.findUniqueOrThrow({
    where: {
      id: followup.clientId,
    },
  });

  if (followup.conversationSid) {
    const payload = {
      conversationSid: followup.conversationSid,
      contentSid: SYSTEM_CONTENT_SID_MAP.initialMessage.sid,
      contentVariables: {
        name: client.name,
      },
    };
    const response = await sendSystemMessage(payload);

    console.log({ response });

    // TODO: replace it with message sent by the system
    const systemSentMessage =
      SYSTEM_CONTENT_SID_MAP.initialMessage.template.replace(
        '{{name}}',
        client.name
      );
    return systemSentMessage;
  }

  throw new Error('Conversation not found');
};
