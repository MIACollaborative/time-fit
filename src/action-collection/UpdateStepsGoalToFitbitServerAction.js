import FitbitAPIHelper from "../data-source/fitbit/FitbitAPIHelper";

export default class UpdateStepsGoalToFitbitServerAction {
  constructor() {}
  static async execute(actionInfo, params) {
    const { userInfo, datetime } = params;
    const theUser = userInfo;

    const fitbitID = theUser.fitbitId;
    const accessToken = theUser.accessToken;
    const dailyStepGoal = theUser.dailyStepsGoal;

    const setResult = await FitbitAPIHelper.setActivityGoalsForFitbitID(
      fitbitID,
      accessToken,
      "daily",
      "steps",
      dailyStepGoal
    );
    
    resultStatus = "success";
    resultErrorMessage = "";
    resultBody = {
      ...setResult,
    };

    return {
      type: "update-steps-goal-to-fitbit-server",
      value: {
        status: resultStatus,
        errorMessage: resultErrorMessage,
        body: resultBody,
      },
    };
  }
}
