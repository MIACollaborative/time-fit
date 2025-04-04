import { getDiff } from "json-difference";

export default class DataRecordHelper {
  constructor() {}

  static getObjectAsJSONDiff(oldObj, newObj) {
    const oldDocument = JSON.parse(JSON.stringify(oldObj));
    const newDocument = JSON.parse(JSON.stringify(newObj));
    return getDiff(oldDocument, newDocument, true);
  }
}
