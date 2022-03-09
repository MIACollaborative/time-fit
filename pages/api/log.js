import prisma from "../../lib/prisma" 

export default async function handler(req, res) {
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
