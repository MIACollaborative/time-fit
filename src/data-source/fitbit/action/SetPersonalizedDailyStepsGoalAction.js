import RandomizationHelper from '../../../helper/RandomizationHelper.js';
import FitbitDataHelper from '../helper/FitbitDataHelper.js';
import UserInfoHelper from '../../../helper/UserInfoHelper.js';
import FitbitAPIHelper from '../helper/FitbitAPIHelper.js';

export default class SetPersonalizedDailyStepsGoalAction {
  constructor() {}
  static async execute(actionInfo, params) {
    const { userInfo, datetime } = params;

    const endDateTime = DateTime.now().minus({ days: 1 });
        const endDateString = endDateTime.toFormat("yyyy-MM-dd");
        // look over the past 30 days, including yesterday
        const startDateString = endDateTime
          .minus({ days: 30 })
          .toFormat("yyyy-MM-dd");

        const wearingDateStepsList =
          await FitbitDataHelper.getUserFitbitDailyStepsForWearingDaysDuringPeriodById(
            userInfo.fitbitId,
            startDateString,
            endDateString,
            "steps",
            60 * 8,
            3
          );

        // (average recorded steps for most recent 3 valid days1) * randomly choose (0.6 | 0.8 | 1.2) rounded to the nearest 100
        let averageStepGoal = 0;

        const randomMultiplier = [0.6, 0.8, 1.2][
          RandomizationHelper.getRandomIntInclusiveRNG(0, 2)
        ];

        if (wearingDateStepsList.length === 3) {
          // calculate average step goals
          averageStepGoal =
            wearingDateStepsList.reduce(
              (total, next) => total + next.steps,
              0
            ) / wearingDateStepsList.length;
        } else {
          // grab the curren daily step goal
          const theUser = await UserInfoHelper.getUserInfoByUsername(
            userInfo.username
          );

          const fitbitGoals = await FitbitAPIHelper.getActivityGoalsForFitbitID(
            theUser.fitbitId,
            theUser.accessToken,
            "daily"
          );
          averageStepGoal = fitbitGoals["goals"]["steps"];
        }

        const roundedStepGoal =
          Math.floor((averageStepGoal * randomMultiplier) / 100) * 100;

        let finalStepGoal = roundedStepGoal;

        const stepGoalLowerBound = 5000;
        const stepGoalUpperBound = 12000;

        if (roundedStepGoal < stepGoalLowerBound) {
          finalStepGoal = stepGoalLowerBound;
        } else if (roundedStepGoal > stepGoalUpperBound) {
          finalStepGoal = stepGoalUpperBound;
        }

        const goalSettingMeta = {
          averageStepGoal: averageStepGoal,
          randomMultiplier: randomMultiplier,
          roundedStepGoal: roundedStepGoal,
          finalStepGoal: finalStepGoal,
          wearingDateGoalList: wearingDateStepsList,
          createdAt: DateTime.now().toISO(),
        };

        await UserInfoHelper.updateUserInfo(userInfo, {
          dailyStepsGoal: finalStepGoal,
          dailyStepsGoalMeta: goalSettingMeta,
        });

        resultStatus = "success";
        resultErrorMessage = "";
        resultBody = {
          ...goalSettingMeta,
        };

        return {
          type: "set-personal-daily-steps-goal",
          value: {
            status: resultStatus,
            errorMessage: resultErrorMessage,
            body: resultBody,
          },
        };
  }
}
