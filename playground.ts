import { PrismaClient } from './lib/generated/prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  try {
    // Your playground code goes here
    console.log('Prisma client initialized successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
