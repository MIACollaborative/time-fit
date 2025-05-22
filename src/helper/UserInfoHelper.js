import ObjectHelper from "./ObjectHelper";
import {getPrismaClient} from "./prisma.js";
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
    const theUser = await getPrismaClient().users.findFirst({
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
}
