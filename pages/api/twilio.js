import TwilioHelper from "../../lib/TwilioHelper.mjs";


export default async function handler(req, res) {
    const { function_name } = req.query;
    

    console.log(`function: ${function_name}`);

    switch (function_name) {
        case "send_message":
            const {phone,  messageBody } = req.body;
            TwilioHelper.sendMessage(phone, messageBody);
            res.status(200).json({ result: "success" });
            return;
        default:
            return;
    }
}
