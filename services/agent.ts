import { openai } from '@ai-sdk/openai';
import { generateText, Message, tool } from 'ai';
import { z } from 'zod';
import { Followup } from '@/lib/generated/prisma';
import prisma from '@/lib/prisma';
import { giggerAttendanceConfirmation, humanAssistance } from './tool';
const chatGptmodel = openai('gpt-4-turbo');

export const generateFollowupMessages = async (
  followup: Followup
): Promise<Message[]> => {
  const messages = await prisma.message.findMany({
    where: {
      followupId: followup.id,
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
    // model: model,
    model: chatGptmodel,
    messages: messages,
    tools: {
      giggerAttendanceConfirmation,
      humanAssistance,
    },
    toolChoice: 'auto',
    system: `
    You are a helpful assistant that generates followup messages for a given conversation. You have access to a tool to confirm attendance for giggers.

    When you need to confirm attendance, you should use the giggerAttendanceConfirmation tool with the following parameters:
    - gigger_id: The ID of the gigger
    - booking_id: The ID of the booking
    - gigger_will_check_in: Whether the gigger will check in ("yes" or "no")
    - reason: The reason for the attendance confirmation

    Example tool usage:
    When a gigger confirms they will attend a shift, use the tool like this:
    {
      "gigger_id": "123",
      "booking_id": "456",
      "gigger_will_check_in": "yes",
      "reason": "Gigger confirmed attendance via message"
    }

    Always use the tool when attendance needs to be confirmed, and provide clear responses to the user about the confirmation status.
    `,

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
