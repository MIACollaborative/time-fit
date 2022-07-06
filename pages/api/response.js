import prisma from "../../lib/prisma"
import { getSession } from "next-auth/react";
import DatabaseUtility from "../../lib/DatabaseUtility.mjs";

export default async function handler(req, res) {
    const session = await getSession({ req })
    if (!session) {
      // Not Signed in
      res.status(401).json({});
      res.end();
      return
    }

    
    const { function_name } = req.query;

    
    

    console.log(`function: ${function_name}`);


    const {username} = req.body;

    switch (function_name) {
        case "is_survey_completed":
            const {surveyId} = req.body;
            let result = await DatabaseUtility.isSurveyCompleted(surveyId);
            res.status(200).json({ result: result });
            return;
        default:
            return;
    }
}
