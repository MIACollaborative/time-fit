import { MongoMemoryServer } from 'mongodb-memory-server';
import { PrismaClient } from '@prisma/client';
import EventHelper from '../EventHelper.js';

let mongod;
let prisma;

import { execSync } from 'child_process';

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.DATABASE_URL = uri;
  // Run prisma db push to create collections in the in-memory MongoDB
  execSync('npx prisma db push', { stdio: 'inherit' });
  prisma = new PrismaClient();
  // Force re-initialize prisma in EventHelper
  if (globalThis.prisma) delete globalThis.prisma;
  // Wait for connection
  await prisma.$connect();
});

afterAll(async () => {
  if (prisma) await prisma.$disconnect();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  // Clean up the event collection after each test
  await prisma.event.deleteMany();
});

describe('EventHelper.insertEvent', () => {
  it('should insert an event and return the created event', async () => {
    const event = {
      type: 'test',
      content: { foo: 'bar' },
    };
    const result = await EventHelper.insertEvent(event);
    expect(result).toHaveProperty('id');
    expect(result.type).toBe('test');
    expect(result.content).toEqual({ foo: 'bar' });
    expect(result).toHaveProperty('createdAt');

    // Also verify it is in the database
    const found = await prisma.event.findUnique({ where: { id: result.id } });
    expect(found).not.toBeNull();
    expect(found.type).toBe('test');
    expect(found.content).toEqual({ foo: 'bar' });
  });

  it('should throw if required fields are missing', async () => {
    await expect(EventHelper.insertEvent({})).rejects.toThrow();
  });
});
