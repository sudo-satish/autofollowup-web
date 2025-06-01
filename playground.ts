import { PrismaClient } from './lib/generated/prisma/client';
import { generateFollowupMessages, invokeAgent } from './services/agent';
import { createConversation, createParticipants } from './services/twillio';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  try {
    // Your playground code goes here
    // console.log('Prisma client initialized successfully!');

    // const agent = {
    //   name: 'Test',
    // };

    // const userClient = {
    //   name: 'Test',
    //   countryCode: '+1',
    //   phone: '1234567890',
    // };

    // const address = 'whatsapp:+918130626713';

    // const conversation = await createConversation(
    //   `${agent.name} - ${userClient.name}`
    // );
    // await createParticipants({
    //   conversationSid: conversation.sid,
    //   address,
    // });

    const followup = await prisma.followup.findFirst({
      where: {
        id: 35,
      },
    });

    const messages = await generateFollowupMessages(followup!);
    const message = await invokeAgent(messages);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
