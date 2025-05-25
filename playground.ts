import { PrismaClient } from './lib/generated/prisma/client';
import {
  invokeAgent,
  generateFollowupMessages,
  persistFollowupMessage,
} from './services/agent';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function userResponse(followupId: number, userMessage: string) {
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
}

async function main() {
  try {
    // Your playground code goes here
    console.log('Prisma client initialized successfully!');

    // await userResponse(8, 'I will be able to make it.I am feeling better now');
    await userResponse(8, 'Is there any thing I can help you with?');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
