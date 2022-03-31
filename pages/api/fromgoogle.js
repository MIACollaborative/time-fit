// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    console.log(`fromgoogle: ${JSON.stringify(req.body)}`);
    const aResponse = await prisma.response.create({
            data: {
                content: req.body,
            },
        });

    res.status(200).json({ result: aResponse });

}
  