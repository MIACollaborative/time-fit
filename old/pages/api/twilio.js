import TwilioHelper from "../../lib/TwilioHelper.mjs";

export default async function handler(req, res) {
    const { function_name } = req.query;
    

    console.log(`function: ${function_name}`);

    switch (function_name) {
        case "send_message":
            const {phone,  messageBody, mediaUrlList} = req.body;
            console.log(`send_message: phone: ${phone}, messageBody: ${messageBody}, mediaUrlList: ${mediaUrlList} `);
            let resultPromise = await TwilioHelper.sendMessage(phone, messageBody, mediaUrlList == null? []: mediaUrlList);
            res.status(200).json({ result: resultPromise });
            return;
        default:
            return;
    }
}
