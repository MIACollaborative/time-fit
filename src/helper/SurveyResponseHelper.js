import prisma from "./prisma.mjs";

export default class SurveyResponseHelper {
  constructor() {}

  static async findSurveyResponseDuringPeriod(
    surveyId,
    startDate,
    endDate,
    limit = 0
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
          dateTime: "desc",
        },
      ],
    };

    if (limit > 0) {
      queryObj["take"] = limit;
    }

    const responseList = await prisma.response.findMany(queryObj);

    return responseList;
  }
}
