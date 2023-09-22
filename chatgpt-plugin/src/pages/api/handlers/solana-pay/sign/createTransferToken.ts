import { NextApiRequest } from "next";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createTransferCheckedInstruction,
  getMint,
  Mint,
} from "@solana/spl-token";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import configConstants, { CONNECTION } from "../../../constants";
configConstants();

async function createTransferToken(req: NextApiRequest) {
  const { amount } = req.query;
  const { account } = req.body;

  const sender = new PublicKey(account);
  const destination = req.query["destination"] as any as PublicKey;
  const mint = req.query["mint"] as any as PublicKey;

  let mintAccount: Mint;
  try {
    mintAccount = await getMint(CONNECTION, mint, "confirmed");
  } catch (error) {
    throw new Error(`Mint ${mint.toString()} not found`);
  }

  const sourceToken = getAssociatedTokenAddressSync(mint, sender);
  const destinationToken = getAssociatedTokenAddressSync(mint, destination);

  const tx = new Transaction();
  const tokens = Math.round(Number(amount as string) * Math.pow(10, mintAccount.decimals));

  tx.add(
    createTransferCheckedInstruction(
      sourceToken,
      mint,
      destinationToken,
      sender,
      tokens,
      mintAccount.decimals,
    ),
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
