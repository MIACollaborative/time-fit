import prisma from "./prisma.js";
export default class UserInfoHelper {
  constructor() {}
  static isPropertySet(userInfo, propertyName) {
    if (userInfo == null) {
      return false;
    }
    return userInfo[propertyName] != undefined;
  }

  static async getUserInfoByUsername(username) {
    const theUser = await prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    return theUser;
  }

  static extractUserInfoCache(userInfo) {
    const { id, password, hash, accessToken, refreshToken, ...rest } = userInfo;
    return { ...rest };
  }

  static async updateUserInfo(userInfo, propertyValueObject) {
    const updateResult = await prisma.users.update({
      where: {
        username: userInfo.username,
      },
      data: {
        ...propertyValueObject,
      },
    });

    return updateResult;
  }
}
