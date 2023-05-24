import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "querystring";
import configConstants, { SELF_URL } from "../../constants";
configConstants();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { txSlug },
  } = req;

  let encoded = encode(Object(req.body));
  res.status(200).send({
    qrCode: `${SELF_URL}/api/handlers/solana-pay/qr/${txSlug}?${encoded}`,
    disclaimer: `This product uses artificial intelligence ("AI"), which may produce inaccurate information. You are responsible for transactions you authorize, so please confirm accuracy of instructions prior to authorizing any transaction.`,
  });
}
