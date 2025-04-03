import { getDiff } from "json-difference";

export default class DataRecordHelper {
  constructor() {}

  static getObjectAsJSONDiff(oldObj, newObj) {
    let oldDocument = JSON.parse(JSON.stringify(oldObj));
    let newDocument = JSON.parse(JSON.stringify(newObj));
    return getDiff(oldDocument, newDocument, true);
  }
}
