import prisma from "./prisma.js";

// To DO: break this into multiple files and remove it.
export default class EventHelper {
  constructor() {}

  static async insertEvent(event) {
    const createResult = await prisma.event.create({
      data: event,
    });
    return createResult;
  }
}
