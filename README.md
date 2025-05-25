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
- Select user
- Select follow-up person
- Select channel
- Select follow-up datetime
- Add context
- Chat thread (Overview)
- Status


Migrate prisma changes to DB

```
npx prisma migrate dev --name add-user-client-relation
```

Seed DB
```
npx prisma db seed
```