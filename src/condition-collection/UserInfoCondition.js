import UserInfoHelper from "../helper/UserInfoHelper.js";

export default class UserInfoCondition {
  constructor() {}
  
  static async execute(condition, params) {
    const { userInfo, datetime } = params;

    const result = UserInfoHelper.isUserInfoPropertyValueMatched(
      userInfo,
      condition.criteria
    );

    const recordInfo = {
      userInfoPartial: UserInfoHelper.extractUserInfoPropertyValueMatched(
        userInfo,
        condition.criteria
      ),
    };

    return {
      result,
      recordInfo,
    };
  }
}
