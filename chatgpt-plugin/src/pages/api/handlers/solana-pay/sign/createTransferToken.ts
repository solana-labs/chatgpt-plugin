import { NextApiRequest } from "next";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import configConstants, { CONNECTION } from "../../../constants";
configConstants();

async function createTransferToken(req: NextApiRequest) {
  const { amount } = req.query;
  const { account } = req.body;

  const sender = new PublicKey(account);
  const destination = req.query["destination"] as any as PublicKey;
  const mint = req.query["mint"] as any as PublicKey;

  const sourceToken = getAssociatedTokenAddressSync(mint, sender);
  const destinationToken = getAssociatedTokenAddressSync(mint, destination);

  const tx = new Transaction();
  tx.add(
    createTransferInstruction(sourceToken, destinationToken, sender, Number(amount as string)),
  );
  tx.feePayer = sender;
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;

  return {
    transaction: tx.serialize({ requireAllSignatures: false }).toString("base64"),
  };
}

export default makeRespondToSolanaPayGet(
  makeRespondToSolanaPayPost(createTransferToken, { addresses: ["destination"], tokens: ["mint"] }),
);
