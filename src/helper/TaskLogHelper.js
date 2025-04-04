import prisma from "./prisma.mjs";

export default class TaskLogHelper {
  constructor() {}

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
}
