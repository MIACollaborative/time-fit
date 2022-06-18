import prisma from "../../lib/prisma"
import { getSession } from "next-auth/react";
import DatabaseUtility from "../../lib/DatabaseUtility.mjs";
import GeneralUtility from "../../lib/GeneralUtility.mjs";
import { CompositionSettingsList } from "twilio/lib/rest/video/v1/compositionSettings";

export default async function handler(req, res) {
    const session = await getSession({ req })

    let isLocal = GeneralUtility.isRequestFromLocalhost(req);

    console.log(`message-composer - isLocal: ${isLocal}`);
    console.log(`message-composer - session: ${session}`);

    /*
    if (!isLocal && !session) {
      // Not local and not login either
      res.status(401).json({});
      res.end();
      return
    }
    */

    const { function_name } = req.query;
    console.log(`message-composer - function: ${function_name}`);


    switch (function_name) {
        case "compose_message":
            const {userInfo, messageInfo, surveyURL} = req.body;
            let message = await DatabaseUtility.composeUserMessageForTwilio(userInfo, messageInfo, surveyURL);
            console.log(`message-composer: message: ${message}`);
            //res.status(200).json({ name: 'John Doe' }).end();
            res.status(200).json({ result: message });
            return;
        default:
            res.status(401).json({});
            res.end();
            return;
    }
}
