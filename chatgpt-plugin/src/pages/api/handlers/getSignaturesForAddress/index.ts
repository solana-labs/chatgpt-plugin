import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey } from "@solana/web3.js";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let accountAddress: PublicKey;
  try {
    accountAddress = new PublicKey(req.body.address);
  } catch (_e) {
    res.status(400).send({ message: "Provided address is not a valid Solana address" });
    return;
  }

  const beforeSig = req.body.beforeSignature ?? "";
  const untilSig = req.body.untilSignature ?? "";
  const signatures = await CONNECTION.getSignaturesForAddress(accountAddress, {
    limit: 11,
    before: beforeSig.length > 0 ? beforeSig : undefined,
    until: untilSig.length > 0 ? untilSig : undefined,
  });
  res.status(200).send({
    hasMore: signatures.length === 11,
    nextPage: signatures.length === 11 ? { beforeSignature: signatures[10].signature } : null,
    signatures: signatures.map(sig => {
      return {
        slot: sig.slot,
        signature: sig.signature,
        err: sig.err ?? undefined,
        memo: sig.memo ?? undefined,
        confirmationStatus: sig.confirmationStatus,
        blockTime: new Date((sig.blockTime as number) * 1000).toDateString(),
      };
    }),
  });
}
