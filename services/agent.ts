import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateText, Message } from 'ai';
import { Followup } from '@/lib/generated/prisma';
import prisma from '@/lib/prisma';
import { giggerAttendanceConfirmation, humanAssistance } from './tool';
// const chatGptmodel = openai('gpt-4-turbo');
const googleModel = google('gemini-2.5-pro-preview-05-06');
const model = googleModel;

export const generateFollowupMessages = async (
  followup: Followup
): Promise<Message[]> => {
  const messages = await prisma.message.findMany({
    where: {
      followupId: followup.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return messages.map((message) => ({
    id: message.id.toString(),
    content: message.content,
    role: message.role,
  }));
};

export const invokeAgent = async (messages: Message[]) => {
  const response = await generateText({
    model: model,
    messages: messages,
    tools: {
      giggerAttendanceConfirmation,
      humanAssistance,
    },
    toolChoice: 'auto',
    experimental_telemetry: { isEnabled: true },
  });

  await prisma.agentInvocationAuditTrail.create({
    data: {
      messages: messages as any,
      response: response.response as any,
    },
  });

  return response;
};

export const persistFollowupMessage = async (
  followup: Followup,
  message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const followupMessage = await prisma.message.create({
    data: {
      content: message.content,
      role: message.role,
      followupId: followup.id,
      channel: 'WHATSAPP',
      contentType: 'TEXT',
      createdAt: new Date(),
    },
  });

  return followupMessage;
};
