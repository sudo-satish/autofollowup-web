import { Followup } from '../lib/generated/prisma';
import redis from './redis';
import prisma from '../lib/prisma';

interface SendMessageProps {
  message: string;
  followup: Followup;
}

export const sendMessage = async ({ message, followup }: SendMessageProps) => {
  if (message && followup) {
    const client = await prisma.client.findUniqueOrThrow({
      where: {
        id: followup.clientId,
      },
    });

    const to = `${client.countryCode.replace('+', '')}${client.phone}@c.us`;
    if (!followup.companyId) {
      return;
    }
    redis.publish(
      'whatsapp.send-message',
      JSON.stringify({
        companyId: followup.companyId,
        to,
        message,
      })
    );
  }

  return null;
};
