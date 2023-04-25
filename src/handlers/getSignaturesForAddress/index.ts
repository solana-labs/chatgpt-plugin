import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { CONNECTION } from "../../constants";

export async function getSignaturesForAddress(req: Request, res: Response) {
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
