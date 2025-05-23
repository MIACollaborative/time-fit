import { getPrismaClient } from "./prisma.js";

export default class TaskLogHelper {
  constructor() {}

  static async insertTaskLogList(tasklogList) {
    const prisma = getPrismaClient();
    return await prisma.taskLog.createMany({
      data: tasklogList,
    });
  }

  static async getTaskLogWithErrorDuringPeriod(startDate, endDate) {
    const prisma = getPrismaClient();
    const recordList = await prisma.taskLog.findMany({
      where: {
        createdAt: {
          gte: startDate.toISOString(),
          lte: endDate.toISOString(),
        },
      },
    });

    const filteredRecordList = recordList.filter((taskLog) => {
      return (
        taskLog.executionResult["value"] != undefined &&
        taskLog.executionResult.value.status == "failed"
      );
    });

    return filteredRecordList;
  }
}
