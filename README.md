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

- Select commincation channel.
- Add human assistance feature.
- Add socket/sse for real time message
- Add logger
- Add conversation dump.

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
