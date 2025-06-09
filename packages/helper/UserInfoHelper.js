import ObjectHelper from "./ObjectHelper.js";
import { getPrismaClient } from "./prisma.js";
export default class UserInfoHelper {
  constructor() {}

  static async getUsers() {
    return await getPrismaClient().users.findMany();
  }

  static async myGetUserList() {
    const users = await UserInfoHelper.getUsers();
    const userList = users.map((userInfo) => {
      return ObjectHelper.exclude(userInfo, [
        "password",
        "hash",
        "accessToken",
        "refreshToken",
      ]);
    });
    return userList;
  }

  static async getUserInfoByUsername(username) {
    return await UserInfoHelper.getUserInfoByPropertyValue("username", username);
  }

  static async getUserInfoByPropertyValue(property, value) {
    const theUser = await getPrismaClient().users.findFirst({
      where: {
        [property]: value,
      },
    });
    return theUser;
  }

  static extractUserInfoCache(userInfo) {
    const { id, password, hash, accessToken, refreshToken, ...rest } = userInfo;
    return { ...rest };
  }

  static async updateUserInfo(userInfo, propertyValueObject) {
    const updateResult = await getPrismaClient().users.update({
      where: {
        username: userInfo.username,
      },
      data: {
        ...propertyValueObject,
      },
    });

    return updateResult;
  }

  static doesFitbitInfoExist(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.fitbitId != null &&
      userInfo.fitbitId.length > 0 &&
      userInfo.accessToken != null &&
      userInfo.accessToken.length > 0 &&
      userInfo.refreshToken != null &&
      userInfo.refreshToken.length > 0
    );
  }
}
