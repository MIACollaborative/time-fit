import MessageHelper from "../utility/MessageHelper.js";
import TwilioHelper from "../utility/TwilioHelper.js";

export default class MessageLabelAction {
  constructor() {}
  static async execute(actionInfo, params) {
    messageInfo = await MessageHelper.findMessageByLabel(
      actionInfo.messageLabel
    );

    const messageBody = messageInfo.content;

    // TO DO: too specific. comment out for now.
    /*
    surveyURL = await GeneralUtility.extractSurveyLinkFromAction(actionInfo);

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
        !params.phone ? params.phone : userInfo.phone,
        messageBody,
        gifURL.length > 0 ? [gifURL] : []
      ),
    };
  }
}
