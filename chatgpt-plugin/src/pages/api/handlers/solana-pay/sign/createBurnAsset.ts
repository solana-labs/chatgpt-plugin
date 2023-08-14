import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { createBurnInstruction } from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { PublicKey, Transaction } from "@solana/web3.js";
import { NextApiRequest } from "next";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import configConstants, { CONNECTION } from "../../../constants";
import { bufferToArray, getAsset, getAssetProof, getBubblegumAuthorityPDA } from "../utils/helpers";
configConstants();

export async function createBurnAsset(req: NextApiRequest) {
  const { assetId } = req.query;
  const { account: owner } = req.body;
  if (!owner || !assetId) {
    throw new Error("Missing required parameters");
  }
  let assetProof = await getAssetProof(assetId, CONNECTION.rpcEndpoint);
  const rpcAsset = await getAsset(assetId, CONNECTION.rpcEndpoint);
  const leafNonce = rpcAsset.compression.leaf_id;
  let proofPath = assetProof.proof.map((node: string) => ({
    pubkey: new PublicKey(node),
    isSigner: false,
    isWritable: false,
  }));
  const treeAuthority = await getBubblegumAuthorityPDA(new PublicKey(assetProof.tree_id));
  const leafDelegate = rpcAsset.ownership.delegate
    ? new PublicKey(rpcAsset.ownership.delegate)
    : new PublicKey(rpcAsset.ownership.owner);

  if (rpcAsset.ownership.owner !== owner) {
    throw new Error(
      `NFT is not owned by the expected owner. Expected ${new PublicKey(owner)} but got ${
        rpcAsset.ownership.owner
      }.`,
    );
  }
  const burnIx = createBurnInstruction(
    {
      treeAuthority,
      leafOwner: new PublicKey(rpcAsset.ownership.owner),
      leafDelegate,
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
  const tx = new Transaction().add(burnIx);
  tx.feePayer = new PublicKey(owner);
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;
  return {
    transaction: tx.serialize({ requireAllSignatures: false }).toString("base64"),
  };
}

export default makeRespondToSolanaPayGet(makeRespondToSolanaPayPost(createBurnAsset));
