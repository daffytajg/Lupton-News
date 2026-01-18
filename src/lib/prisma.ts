// Prisma Client Singleton for Next.js
// Prevents multiple instances during hot reload in development
// Returns null if DATABASE_URL is not configured

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaInitialized: boolean;
};

function createPrismaClient(): PrismaClient | null {
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not configured - database features disabled');
    return null;
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Failed to create Prisma client:', error);
    return null;
  }
}

// Only initialize once
if (!globalForPrisma.prismaInitialized) {
  globalForPrisma.prisma = createPrismaClient() ?? undefined;
  globalForPrisma.prismaInitialized = true;
}

export const prisma = globalForPrisma.prisma ?? null;

export default prisma;
// Trigger rebuild with database env vars
