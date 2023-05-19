import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accountAddress = new PublicKey(req.body.address);
  const signatures = await CONNECTION.getSignaturesForAddress(accountAddress, {
    limit: 11,
    before: req.body.beforeSignature ?? null,
    until: req.body.untilSignature ?? null,
  });
  res.status(200).send({
    hasMore: signatures.length === 11,
    nextPage:
      signatures.length === 11
        ? { beforeSignature: signatures[10].signature }
        : null,
    signatures: JSON.stringify(signatures),
  });
}
