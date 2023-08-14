import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { PublicKey, Transaction } from "@solana/web3.js";
import { NextApiRequest } from "next";

import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { createTransferInstruction } from "@metaplex-foundation/mpl-bubblegum";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import configConstants, { CONNECTION } from "../../../constants";
import { bufferToArray, getAsset, getAssetProof, getBubblegumAuthorityPDA } from "../utils/helpers";
configConstants();

async function createTransferAsset(req: NextApiRequest) {
  const { destination, assetId } = req.query;
  const { account: sender } = req.body;
  if (!sender || !destination || !assetId) {
    throw new Error("Missing required parameters");
  }

  const assetProof = await getAssetProof(assetId, CONNECTION.rpcEndpoint);
  if (!assetProof?.proof || assetProof.proof.length === 0) {
    throw new Error("Proof retrieved for the given assetId is empty. Please check the assetId.");
  }
  const proofPath = assetProof.proof.map((node: string) => ({
    pubkey: new PublicKey(node),
    isSigner: false,
    isWritable: false,
  }));
  console.log("Successfully got proof path from RPC.");

  const rpcAsset = await getAsset(assetId, CONNECTION.rpcEndpoint);
  console.log("Successfully got asset from RPC. Current owner: " + rpcAsset.ownership.owner);
  if (rpcAsset.ownership.owner !== sender) {
    throw new Error(
      `NFT is not owned by the expected owner. Expected ${new PublicKey(sender)} but got ${
        rpcAsset.ownership.owner
      }.`,
    );
  }

  const leafNonce = rpcAsset.compression.leaf_id;
  const treeAuthority = await getBubblegumAuthorityPDA(new PublicKey(assetProof.tree_id));
  const leafDelegate = rpcAsset.ownership.delegate
    ? new PublicKey(rpcAsset.ownership.delegate)
    : new PublicKey(rpcAsset.ownership.owner);
  let transferIx = createTransferInstruction(
    {
      treeAuthority,
      leafOwner: new PublicKey(rpcAsset.ownership.owner),
      leafDelegate: leafDelegate,
      newLeafOwner: new PublicKey(destination as string),
      merkleTree: new PublicKey(assetProof.tree_id),
      logWrapper: SPL_NOOP_PROGRAM_ID,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      anchorRemainingAccounts: proofPath,
    },
    {
      root: bufferToArray(bs58.decode(assetProof.root)),
      dataHash: bufferToArray(bs58.decode(rpcAsset.compression.data_hash.trim())),
      creatorHash: bufferToArray(bs58.decode(rpcAsset.compression.creator_hash.trim())),
      nonce: leafNonce,
      index: leafNonce,
    },
  );
  const tx = new Transaction().add(transferIx);
  tx.feePayer = new PublicKey(sender);
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;
  return {
    transaction: tx.serialize({ requireAllSignatures: false }).toString("base64"),
  };
}
export default makeRespondToSolanaPayGet(makeRespondToSolanaPayPost(createTransferAsset));
