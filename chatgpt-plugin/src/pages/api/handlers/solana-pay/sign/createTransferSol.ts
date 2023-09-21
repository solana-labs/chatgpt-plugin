import { NextApiRequest } from "next";
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import configConstants, { CONNECTION } from "../../../constants";
configConstants();

async function createTransferSol(req: NextApiRequest) {
  const { amount } = req.query;
  const { account } = req.body;

  const sender = new PublicKey(account);
  const destination = req.query["destination"] as any as PublicKey;

  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: destination,
      lamports: Math.floor(parseFloat(amount as string) * LAMPORTS_PER_SOL),
    }),
  );
  tx.feePayer = sender;
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;

  return {
    transaction: tx.serialize({ requireAllSignatures: false }).toString("base64"),
  };
}

export default makeRespondToSolanaPayGet(
  makeRespondToSolanaPayPost(createTransferSol, { addresses: ["destination"] }),
);
