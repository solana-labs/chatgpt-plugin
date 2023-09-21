// DEPRECATED - not in use
import { NextApiRequest } from "next";
import { PublicKey } from "@solana/web3.js";

import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import configConstants, { CONNECTION } from "../../../constants";
import { createSetProfilePictureTransaction } from "@solflare-wallet/pfp";
configConstants();

async function createSetProfilePic(req: NextApiRequest) {
  const { mintPublicKey, tokenAccountPublicKey } = req.query;
  const { account: ownerAccountPublicKey } = req.body;

  const tx = await createSetProfilePictureTransaction(
    new PublicKey(ownerAccountPublicKey),
    new PublicKey(mintPublicKey as string),
    new PublicKey(tokenAccountPublicKey as string),
  );
  tx.feePayer = new PublicKey(ownerAccountPublicKey);
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;

  return {
    transaction: tx.serialize({ requireAllSignatures: false }).toString("base64"),
  };
}

export default makeRespondToSolanaPayGet(makeRespondToSolanaPayPost(createSetProfilePic));
