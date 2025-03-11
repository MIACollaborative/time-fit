//import prisma from "./prisma.mjs";

export default class UserInfoHelper {
  constructor() {}
  static isPropertySet(userInfo, propertyName) {
    if (userInfo == null) {
      return false;
    }
    return userInfo[propertyName] != undefined;
  }
}
