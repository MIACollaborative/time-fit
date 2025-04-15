import prisma from "./prisma.js";

// To DO: break this into multiple files and remove it.
export default class TaskHelper {
  constructor() {}

  static async getTasksSortedByPriority(sorting = "asc") {
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
