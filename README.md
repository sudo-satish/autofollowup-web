# FollowAI.in

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

TODO:

- Add socket.io
- Add redis
- Connect to whatsappweb
- Present QR code
- Send and recieve message via whatsapp web.

Migrate prisma changes to DB

```
npx prisma migrate dev --name add-user-client-relation
```

Seed DB

```
npx prisma db seed
```

Run playground

```
 npx ts-node --compiler-options '{"module":"CommonJS"}' -r tsconfig-paths/register playground.ts
```

Start ngrok to recieve incoming messages;

```
ngrok http --url=prime-national-stinkbug.ngrok-free.app http://localhost:3000
```

git@github.com:sudo-satish/autofollowup-web.git

git@github.com-autofollowup:sudo-satish/autofollowup-web.git
