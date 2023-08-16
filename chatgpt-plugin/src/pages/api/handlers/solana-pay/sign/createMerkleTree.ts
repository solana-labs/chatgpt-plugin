import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  createCreateTreeInstruction,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  createAllocTreeIx,
} from "@solana/spl-account-compression";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import dotenv from "dotenv";
import { NextApiRequest } from "next";
import { CONNECTION } from "../../../constants";
dotenv.config();

//TODO(@ngundotra): have to add closeTree instruction before exposing this endpoint

export interface MerkleTreeArgs {
  maxDepth: number;
  maxBufferSize: number;
  canopyHeight: number;
}

export async function createTree(req: NextApiRequest) {
  const { account: payerPublicKey, canopyDepth, maxDepthSizePair } = req.body;
  const treeKeypair = Keypair.generate();

  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeKeypair.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID,
  );

  // instruction for space allocation for tree account
  const allocTreeIx = await createAllocTreeIx(
    CONNECTION,
    treeKeypair.publicKey,
    payerPublicKey,
    maxDepthSizePair,
    canopyDepth,
  );

  // instruction for tree creation
  const createTreeIx = createCreateTreeInstruction(
    {
      payer: payerPublicKey,
      treeCreator: payerPublicKey,
      treeAuthority: treeAuthority,
      merkleTree: treeKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      maxBufferSize: maxDepthSizePair.maxBufferSize,
      maxDepth: maxDepthSizePair.maxDepth,
      public: false,
    },
    BUBBLEGUM_PROGRAM_ID,
  );

  try {
    const tx = new Transaction();
    tx.add(allocTreeIx);
    tx.add(createTreeIx);
    tx.feePayer = payerPublicKey;
    return tx;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
