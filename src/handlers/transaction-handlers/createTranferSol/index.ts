import { Request } from "express";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { CONNECTION } from "../../../constants";

export async function createTransferSol(req: Request) {
  const { destination, amount } = req.query;
  const { account: sender } = req.body;

  const tx = new Transaction();
  tx.add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(sender),
      toPubkey: new PublicKey(destination as string),
      lamports: Math.floor(parseFloat(amount as string) * LAMPORTS_PER_SOL),
    })
  );
  tx.feePayer = new PublicKey(sender);
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;

  return {
    transaction: tx
      .serialize({ requireAllSignatures: false })
      .toString("base64"),
  };
}
