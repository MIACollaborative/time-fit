import UserInfoHelper from "../utility/UserInfoHelper";

export default class ActivateParticipantAction {
  constructor() {}
  static async execute(actionInfo, params) {
    const { userInfo, datetime } = params;

    const result = await UserInfoHelper.updateUserInfo(userInfo, {
      phase: actionInfo.phase,
      activateAt: DateTime.utc().toISO(),
    });

    resultStatus = "success";
    resultErrorMessage = "";
    resultBody = result;

    return {
      type: "activate-participant",
      value: {
        status: resultStatus,
        errorMessage: resultErrorMessage,
        body: resultBody,
      },
    };
  }
}
