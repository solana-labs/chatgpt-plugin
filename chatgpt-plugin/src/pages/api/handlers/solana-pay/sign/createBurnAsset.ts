import {
    SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
    SPL_NOOP_PROGRAM_ID,
  } from "@solana/spl-account-compression";
  import { NextApiRequest } from "next";
  import { PublicKey, Transaction } from "@solana/web3.js";
  import { WrappedConnection } from "../utils/wrappedConnection"
  import {
    bufferToArray,
    getBubblegumAuthorityPDA
  } from "../utils/helpers";
  import {
    createBurnInstruction
  } from "@metaplex-foundation/mpl-bubblegum";
  import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
  import configConstants, { CONNECTION } from "../../../constants";
  configConstants();


export async function createBurnAsset(req: NextApiRequest) {
    /*
    connectionWrapper: WrappedConnection,
    owner: Keypair,
    assetId?: string
    */
    const { newOwner, assetId } = req.query;
    const { account: owner } = req.body;
    if (!owner || !newOwner || !assetId) {
      throw new Error("Missing required parameters");
    }
    const connectionWrapper = new WrappedConnection(owner, CONNECTION.rpcEndpoint);
    let assetProof = await connectionWrapper.getAssetProof(assetId);
    const rpcAsset = await connectionWrapper.getAsset(assetId);
    const leafNonce = rpcAsset.compression.leaf_id;
    let proofPath = assetProof.proof.map((node: string) => ({
      pubkey: new PublicKey(node),
      isSigner: false,
      isWritable: false,
  }));
    const treeAuthority = await getBubblegumAuthorityPDA(
      new PublicKey(assetProof.tree_id)
    );
    const leafDelegate = rpcAsset.ownership.delegate
      ? new PublicKey(rpcAsset.ownership.delegate)
      : new PublicKey(rpcAsset.ownership.owner);
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
    const tx = new Transaction().add(burnIx);
    tx.feePayer = owner.publicKey;
    return tx;
  };