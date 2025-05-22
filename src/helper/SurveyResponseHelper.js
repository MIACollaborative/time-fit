import {getPrismaClient} from "./prisma.js";

export default class SurveyResponseHelper {
  constructor() {}

  static async findSurveyResponseDuringPeriod(
    surveyId,
    startDate,
    endDate,
    sort = "desc",
    limit = -1
  ) {
    let queryObj = {
      where: {
        surveyId: surveyId,
        dateTime: {
          gte: startDate.toISO(),
          lte: endDate.toISO(),
        },
      },
      orderBy: [
        {
          dateTime: sort,
        },
      ],
    };

    if (limit >= 0) {
      queryObj["take"] = limit;
    }
    
    const prisma = getPrismaClient();
    const responseList = await prisma.response.findMany(queryObj);

    return responseList;
  }
}
