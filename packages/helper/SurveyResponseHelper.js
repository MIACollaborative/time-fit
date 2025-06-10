import { getPrismaClient } from "./prisma.js";

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

  static async findSurveyResponsesByCriteria(
    criteria
  ) {
    const prisma = getPrismaClient();
    const responseList = await prisma.response.findMany(criteria);
    return responseList;
  }

  static async isSurveyCompletedByPerson(surveyId, personId) {
    const startDate = DateTime.utc(2000);
    const endDate = DateTime.utc();

    const responseList =
      await SurveyResponseHelper.findSurveyResponseDuringPeriod(
        surveyId,
        startDate,
        endDate,
        0
      );

    const filteredResponseList = responseList.filter((responseInfo) => {
      return responseInfo.participantId == personId;
    });

    return filteredResponseList.length > 0;
  }
}
