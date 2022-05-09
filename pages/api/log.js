import prisma from "../../lib/prisma" 
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req })
    if (!session) {
      // Not Signed in
      res.status(401).json({});
      res.end();
      return
    }
    
  const { function_name } = req.query;
  const { type, content } = req.body;

  console.log(`function: ${function_name}`);

  switch (function_name) {
    case "logToDB":
      const aLog = await prisma.log.create({
        data: {
          type: type,
          content: content,
        },
      });
      res.status(200).json({ result: aLog });
      return;
    default:
      return;
  }
}
