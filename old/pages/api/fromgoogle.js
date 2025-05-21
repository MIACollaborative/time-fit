import prisma from "../../lib/prisma";

export default async function handler(req, res) {
    console.log(`fromgoogle: ${JSON.stringify(req.body)}`);

    // version 2: extract information
    const aResponse = await prisma.response.create({
        data: {
            ...req.body
        },
    });

    res.status(200).json({ result: aResponse });

}
  