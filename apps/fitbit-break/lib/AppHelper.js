export default class AppHelper {
  constructor() {}
  static isPreferredNameSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.preferredName != undefined && userInfo.preferredName.length > 0
    );
  }

  static isWakeBedTimeSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.weekdayWakeup != undefined &&
      userInfo.weekdayBed != undefined &&
      userInfo.weekendWakeup != undefined &&
      userInfo.weekendBed != undefined
    );
  }

  static isFitbitReminderTurnOff(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.fitbitReminderTurnOff != undefined &&
      userInfo.fitbitReminderTurnOff
    );
  }

  static isWalkToJoySaveToContacts(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return (
      userInfo.saveWalkToJoyToContacts != undefined &&
      userInfo.saveWalkToJoyToContacts
    );
  }

  static isWalkSetTo10(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return userInfo.autoWalkTo10 != undefined && userInfo.autoWalkTo10;
  }

  static isTimezoneSet(userInfo) {
    if (userInfo == null) {
      return false;
    }

    return userInfo.timezone != undefined;
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
