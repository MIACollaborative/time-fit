//import { PrismaClient } from "@prisma/client";


// version 2


import { PrismaClient } from '@prisma/client'

/*
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
*/

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma;


// version 1
/*
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
export default prisma;
*/