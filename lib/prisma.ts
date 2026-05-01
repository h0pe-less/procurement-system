import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const adapter = new PrismaMariaDb({
  user: process.env["DATABASE_USER"],
  password: process.env['DATABASE_PASSWORD'],
  host: "localhost",
  database: process.env['DATABASE_NAME'],
  port: 3306,
  allowPublicKeyRetrieval: true,
  connectionLimit: 5,
});
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Logs SQL queries to your terminal (helpful for debugging)
    adapter
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;