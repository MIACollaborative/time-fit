import prisma from "./prisma.js";

export default class DatabaseHelper {
  constructor() {}

  static async insertEvent(event) {
    const createResult = await prisma.event.create({
      data: event,
    });
    return createResult;
  }

  static async insertTaskLogList(tasklogList) {
    return await prisma.taskLog.createMany({
        data: tasklogList,
      });
  }

  static async getUsers() {
    return await prisma.users.findMany();
  }

  static async getTasksSortedByPriority(sorting="asc") {
    return await prisma.task.findMany({
        where: { enabled: true },
        orderBy: [
          {
            priority: sorting,
          },
        ],
      });
  }
}
