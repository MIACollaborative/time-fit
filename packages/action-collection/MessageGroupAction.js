import MessageHelper from "../helper/MessageHelper.js";
import TwilioHelper from "../helper/TwilioHelper.js";

export default class MessageGroupAction {
  constructor() {}
  static async execute(actionInfo, params) {
    messageInfo = await MessageHelper.findMessageByGroup(
      actionInfo.messageGroup
    );
    const messageBody = messageInfo.content;

    return {
      type: "twilio",
      value: await TwilioHelper.sendMessage(
        userInfo.phone,
        messageBody,
        gifURL.length > 0 ? [gifURL] : []
      ),
    };
  }
}
