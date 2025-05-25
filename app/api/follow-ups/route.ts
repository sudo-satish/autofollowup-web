import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    // For example, fetch data from your DB here
    const agents = await prisma.followup.findMany();
    return new Response(JSON.stringify(agents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
   
  export async function POST(request: Request) {
    // Parse the request body
    const body = await request.json();
    const { agent, client, context, dateTime } = body;

    const followup = await prisma.followup.create({
      data: {
        userClientId: +client,
        agentId: +agent,
        context,
        createdAt: new Date(),
        followupDate: dateTime,
        status: 'SCHEDULED',
      }
    })
   
    return new Response(JSON.stringify(followup), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }