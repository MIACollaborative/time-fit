// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import GeneralUtility from "../../lib/GeneralUtility.mjs";

export default function handler(req, res) {
  console.log(`api:hello`);
  console.log(`api:hello.handler isRequestFromLocalhost: ${GeneralUtility.isRequestFromLocalhost(req)}`);
  res.status(200).json({ name: 'John Doe' })
}
