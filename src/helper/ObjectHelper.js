export default class ObjectHelper {
  constructor() {}

  static exclude(item, keyList) {
    const result = { ...item };
    for (let key of keyList) {
      delete result[key];
    }
    return result;
  }

  static isPropertySet(object, propertyName) {
    if (object == null) {
      return false;
    }
    return object[propertyName] != undefined;
  }

  static isObjectPropertyValueMatched(object, propertyValueObject) {
    let result = true;

    Object.keys(propertyValueObject).forEach((propertyName) => {
      // print the property name and value
      console.log(propertyName, propertyValueObject[propertyName]);

      if (object[propertyName] !== null && typeof propertyValueObject[propertyName] === "object") {
        console.log("it is an object", object[propertyName], propertyValueObject[propertyName]);
        result =
          result &&
          ObjectHelper.isObjectPropertyValueMatched(
            object[propertyName],
            propertyValueObject[propertyName]
          );
      } else {
        if (object[propertyName] !== propertyValueObject[propertyName]) {
          console.log(object[propertyName], propertyValueObject[propertyName]);
          result = false;
        }
      }
    });

    return result;
  }

  static extractObjectPropertyValueMatched(object, propertyValueObject) {
    let resultInfo = {};

    Object.keys(propertyValueObject).forEach((propertyName) => {
      resultInfo[propertyName] = object[propertyName];
    });

    return resultInfo;
  }
}
