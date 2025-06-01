import { resetFollowup } from '@/services/follow-up';

export async function POST(request: Request) {
  const body = await request.json();
  const { followupId } = body;

  await resetFollowup(+followupId);

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Followup reset successfully',
    }),
    {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
