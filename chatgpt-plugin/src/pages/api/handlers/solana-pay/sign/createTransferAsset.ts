import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { NextApiRequest } from "next";
import { PublicKey, Transaction } from "@solana/web3.js";
import { WrappedConnection } from "../utils/wrappedConnection"
import {
  bufferToArray,
  getBubblegumAuthorityPDA,
} from "../utils/helpers";
import {
  createTransferInstruction
} from "@metaplex-foundation/mpl-bubblegum";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

import configConstants, { CONNECTION } from "../../../constants";
configConstants();

export async function createTransferAsset(req: NextApiRequest) {
  const { newOwner, assetId } = req.query;
  const { account: owner } = req.body;
  if (!owner || !newOwner || !assetId) {
    throw new Error("Missing required parameters");
  }
  // connectionWrapper: WrappedConnection,
  // owner: Keypair,
  // newOwner: Keypair,
  // assetId: string  
  const connectionWrapper = new WrappedConnection(owner, CONNECTION.rpcEndpoint);
    let assetProof = await connectionWrapper.getAssetProof(assetId);
    if (!assetProof?.proof || assetProof.proof.length === 0) {
      throw new Error("Proof is empty");
    }
    let proofPath = assetProof.proof.map((node: string) => ({
      pubkey: new PublicKey(node),
      isSigner: false,
      isWritable: false,
    }));
    console.log("Successfully got proof path from RPC.");
  
    const rpcAsset = await connectionWrapper.getAsset(assetId);
    console.log(
      "Successfully got asset from RPC. Current owner: " +
        rpcAsset.ownership.owner
    );
    if (rpcAsset.ownership.owner !== owner.publicKey.toBase58()) {
      throw new Error(
        `NFT is not owned by the expected owner. Expected ${owner.publicKey.toBase58()} but got ${
          rpcAsset.ownership.owner
        }.`
      );
    }
  
    const leafNonce = rpcAsset.compression.leaf_id;
    const treeAuthority = await getBubblegumAuthorityPDA(
      new PublicKey(assetProof.tree_id)
    );
    const leafDelegate = rpcAsset.ownership.delegate
      ? new PublicKey(rpcAsset.ownership.delegate)
      : new PublicKey(rpcAsset.ownership.owner);
    let transferIx = createTransferInstruction(
      {
        treeAuthority,
        leafOwner: new PublicKey(rpcAsset.ownership.owner),
        leafDelegate: leafDelegate,
        newLeafOwner: new PublicKey(newOwner),
        merkleTree: new PublicKey(assetProof.tree_id),
        logWrapper: SPL_NOOP_PROGRAM_ID,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        anchorRemainingAccounts: proofPath,
      },
      {
        root: bufferToArray(bs58.decode(assetProof.root)),
        dataHash: bufferToArray(
          bs58.decode(rpcAsset.compression.data_hash.trim())
        ),
        creatorHash: bufferToArray(
          bs58.decode(rpcAsset.compression.creator_hash.trim())
        ),
        nonce: leafNonce,
        index: leafNonce,
      }
    );
    const tx = new Transaction().add(transferIx);
    tx.feePayer = owner.publicKey;
    return tx;
  };