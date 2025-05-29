import { tool } from 'ai';
import { z } from 'zod';

export const giggerAttendanceConfirmation = tool({
  description: 'Confirm attendance for a given shift in the DB.',
  parameters: z.object({
    gigger_id: z.string(),
    booking_id: z.string(),
    gigger_will_check_in: z.string(),
    reason: z.string(),
  }),
  execute: async ({ gigger_id, booking_id, gigger_will_check_in, reason }) => {
    console.log({
      gigger_id,
      booking_id,
      gigger_will_check_in,
      reason,
    });

    return {
      success: true,
      message: 'Attendance confirmed',
    };
  },
});
export const humanAssistance = tool({
  description: 'Request human assistance.',
  parameters: z.object({
    reason: z.string(),
  }),
  execute: async ({ reason }) => {
    console.log({
      name: 'Human Assistance',
      reason,
    });

    return {
      success: true,
      message: 'Human assistance requested',
    };
  },
});
