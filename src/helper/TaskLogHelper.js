import prisma from "./prisma.js";

export default class TaskLogHelper {
  constructor() {}

  static async insertTaskLogList(tasklogList) {
    return await prisma.taskLog.createMany({
      data: tasklogList,
    });
  }

  static async getCurrentUserMessageCountDict(username) {
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
    limit = 0
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
          createdAt: "desc",
        },
      ],
    };

    if (limit > 0) {
      queryObj["take"] = limit;
    }

    const itemList = await prisma.taskLog.findMany(queryObj);

    return itemList;
  }

  static async getTaskLogWithErrorDuringPeriod(startDateTime, endDateTime) {
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
