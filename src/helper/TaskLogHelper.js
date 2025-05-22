import {getPrismaClient} from "./prisma.js";

export default class TaskLogHelper {
  constructor() {}

  static async insertTaskLogList(tasklogList) {
    const prisma = getPrismaClient();
    return await prisma.taskLog.createMany({
      data: tasklogList,
    });
  }

  static async getCurrentUserMessageCountDict(username) {
    const prisma = getPrismaClient();
    const results = await prisma.taskLog.groupBy({
      by: ["messageLabel"],
      where: {
        username: {
          equals: username,
        },
      },
      _count: {
        messageLabel: true,
      },
    });

    const resultList = JSON.parse(JSON.stringify(results, replacer));

    let resultDict = {};

    resultList.forEach((result) => {
      if (result["messageLabel"] != null) {
        resultDict[result["messageLabel"]] = result["_count"]["messageLabel"];
      }
    });

    return resultDict;
  }

  static async findTaskLogWithMessageLabelDuringPeriod(
    messageLabel,
    startDate,
    endDate,
    sorting = "desc",
    limit = -1
  ) {
    let queryObj = {
      where: {
        messageLabel: messageLabel,
        createdAt: {
          gte: startDate.toISO(),
          lte: endDate.toISO(),
        },
      },
      orderBy: [
        {
          createdAt: sorting,
        },
      ],
    };

    if (limit >= 0) {
      queryObj["take"] = limit;
    }

    const prisma = getPrismaClient();
    const itemList = await prisma.taskLog.findMany(queryObj);

    return itemList;
  }

  static async getTaskLogWithErrorDuringPeriod(startDateTime, endDateTime) {
    const prisma = getPrismaClient();
    const recordList = await prisma.taskLog.findMany({
      where: {
        createdAt: {
          gte: startDateTime.toISO(),
          lte: endDateTime.toISO(),
        },
      },
    });

    const filteredRecordList = recordList.filter((taskLog) => {
      return (
        taskLog.executionResult["value"] != undefined &&
        taskLog.executionResult.value.status == "failed"
      );
    });

    return recordList;
  }
}
