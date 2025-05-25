import prisma from '@/lib/prisma';
import { getSystemPrompt } from './prompt';

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
          {
            content: `How can I help you today?`,
            role: 'user',
            channel: 'WHATSAPP',
            contentType: 'TEXT',
            createdAt: new Date(),
          },
        ],
      },
    },
  });

  return newFollowup;
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
