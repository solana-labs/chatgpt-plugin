import { NextApiRequest } from "next";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createTransferInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import configConstants, { CONNECTION } from "../../../constants";
configConstants();


async function createTransferAsset(req: NextApiRequest) {
  
  const { destination } = req.query;
  const { account: sender } = req.body;
  // connectionWrapper: WrappedConnection,
  // owner: Keypair,
  // newOwner: Keypair,
  // assetId: string  
  const connectionWrapper = new WrappedConnection(CONNECTION);
  // console.log(
  //     `Transfering asset ${assetId} from ${owner.publicKey.toBase58()} to ${newOwner.publicKey.toBase58()}. 
  //     This will depend on indexer api calls to fetch the necessary data.`
  //   );
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
        newLeafOwner: newOwner.publicKey,
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
    tx.feePayer = sender.publicKey;
    return tx;
    // try {
    //   const sig = await sendAndConfirmTransaction(
    //     connectionWrapper,
    //     tx,
    //     [owner],
    //     {
    //       commitment: "confirmed",
    //       skipPreflight: true,
    //     }
    //   );
    //   return sig;
    // } catch (e) {
    //   console.error("Failed to transfer compressed asset", e);
    //   throw e;
    // }
  };