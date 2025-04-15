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

  static isUserInfoPropertyValueMatched(userInfo, propertyValueObject) {
    let result = true;

    Object.keys(propertyValueObject).forEach((propertyName) => {
      if (userInfo[propertyName] != propertyValueObject[propertyName]) {
        result = false;
      }
    });

    return result;
  }

  static extractUserInfoPropertyValueMatched(userInfo, propertyValueObject) {
    let resultInfo = {};

    Object.keys(propertyValueObject).forEach((propertyName) => {
      resultInfo[propertyName] = userInfo[propertyName];
    });

    return resultInfo;
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
