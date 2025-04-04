import MessageHelper from "../helper/MessageHelper.js";
import TwilioHelper from "../helper/TwilioHelper.js";

export default class MessageGroupAction {
  constructor() {}
  static async execute(actionInfo, params) {
    messageInfo = await MessageHelper.findMessageByGroup(
      actionInfo.messageGroup
    );
    const messageBody = messageInfo.content;

    // TO DO: too specific. comment out for now.
    /*
      // for logging
      record.messageLabel = messageInfo.label;

      surveyURL = GeneralUtility.extractSurveyLinkFromAction(theAction);
      console.log(`executeActionForUser surveyURL: ${surveyURL}`);

      messageBody = await DatabaseUtility.composeUserMessageForTwilio(
        userInfo,
        messageInfo,
        surveyURL
      );
      if (messageInfo.gif != undefined) {
        gifURL = `${process.env.ASSET_HOST_URL}/image/gif/${messageInfo.gif}.gif`;
      }
    */

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
