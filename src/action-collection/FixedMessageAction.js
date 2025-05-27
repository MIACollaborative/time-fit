export default class FixedMessageAction {
  static message = "";
  constructor(msg) {
    this.message = msg;
  }
  static async execute(actionInfo, params) {
    return {
      type: "console",
      value: FixedMessageAction.message,
    };
  }
}
