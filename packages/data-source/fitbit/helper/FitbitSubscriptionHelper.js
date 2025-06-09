export default class FitbitSubscriptionHelper {
  constructor() {}

  static async createSubscriptionsForUser(
    userInfo,
    collectionTypeList = ["activities", "userRevokedAccess"]
  ) {
    let resultList = [];

    // validate user token first
    // { value: "success", data: userInfo };
    // { value: "failed", data: inspect(error.response.data) };
    let validateTokenResult = await DatabaseUtility.ensureTokenValidForUser(
      userInfo,
      true,
      30 * 60
    );
    let updatedUserInfo;

    if (validateTokenResult.value == "success") {
      updatedUserInfo = validateTokenResult.data;
    } else {
      // cannot update userInfo, need to abort
      return resultList;
    }

    for (let i = 0; i < collectionTypeList.length; i++) {
      let cType = collectionTypeList[i];
      console.log(
        `DatabaseUtility.createSubscriptionsForUser: collection: ${cType}`
      );
      // now, need to determine the subscriptionId
      // count the number of subscription and increase by 1

      // An optional identifier to refer to this subscriber. If none specified, we assign one for you (starting with 1,2,3...) Subscriber IDs may be up to 50 unicode characters long. Fitbit encourages you to choose an ID that makes the most sense to you.

      // version 2: just id and type
      let newSubscriptionId = `${updatedUserInfo.fitbitId}-${cType}`;

      // version 1: with index
      /*
              let currentSubCount = await DatabaseUtility.countSubscription();
              let newSubscriptionId = `${updatedUserInfo.fitbitId}-${cType}-${currentSubCount + 1}`;
              */

      // now, create subscription
      // example result
      /*
              {
                  "collectionType":"activities",
                  "ownerId":"GGNJL9",
                  "ownerType":"user",
                  "subscriberId":"1",
                  "subscriptionId":"320"
              }
              */

      let subscriptionResult = await FitbitHelper.createSubscriptionForFitbitId(
        updatedUserInfo.fitbitId,
        cType,
        newSubscriptionId,
        updatedUserInfo.accessToken
      );

      let { subscriptionId, ...rest } = subscriptionResult;

      // version 2: upsert
      await prisma.fitbit_subscription.upsert({
        where: {
          subscriptionId: subscriptionResult["subscriptionId"],
        },
        update: { ...rest },
        create: subscriptionResult,
      });

      // version 1: create
      /*
              await prisma.fitbit_subscription.create({
                  data: subscriptionResult
              });
              */

      resultList.push(subscriptionResult);
    }

    return resultList;
  }
}
