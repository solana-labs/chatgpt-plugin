import { Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import {
  Metaplex, 
  JsonMetadata
} from "@metaplex-foundation/js";
import {
  MetadataArgs,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  createMintToCollectionV1Instruction,
  TokenProgramVersion,
  TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import configConstants, { CONNECTION } from "../../../constants";
configConstants();
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
dotenv.config();
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";


async function createMintCNFT(
  req: NextApiRequest
) {
  const { metadataUri, treeAddress } = req.query;
  const { account: payer } = req.body;
  
  const metaplex = Metaplex.make(CONNECTION);
  // create compressed nft
  const nftMetadata = await metaplex
            .storage()
            .downloadJson<JsonMetadata>(metadataUri as string);
  console.log("nftMetadata", nftMetadata);
  const compressedNftMetadata: MetadataArgs = {
    name: nftMetadata.name ?? "",
    symbol: nftMetadata.symbol ?? "",
    uri: metadataUri as string,
    sellerFeeBasisPoints: 0,
    creators: [
      {
        address: new PublicKey(payer),
        verified: true,
        share: 100,
      },
    ],
    editionNonce: 0,
    uses: null,
    collection: null,
    isMutable: false,
    primarySaleHappened: false,
    tokenProgramVersion: TokenProgramVersion.Original,
    tokenStandard: TokenStandard.NonFungible,
  };

  // derive PDA (owned bt Bubblegum) to act as the signer of the compressed minting
  const [bubblegumSigner, _bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID
  );
  const collectionOwner = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(process.env.COLLECTION_OWNER_SECRET_KEY as string, "base64")))
  const mintToCollectionIx = createMintToCollectionV1Instruction(
    {
      payer: new PublicKey(payer),

      merkleTree: new PublicKey(process.env.TREE_ADDRESS_1 as string), 
      treeAuthority: new PublicKey(process.env.TREE_AUTHORITY_1 as string),
      treeDelegate: new PublicKey(payer),

      collectionMint: new PublicKey(process.env.CHATGPT_COLLECTION_MINT as string),
      collectionAuthority: collectionOwner.publicKey,
      collectionMetadata: new PublicKey(process.env.CHATGPT_COLLECTION_METADATA_ACCOUNT as string),
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      editionAccount: new PublicKey(process.env.CHATGPT_COLLECTION_MASTER_EDITION_ACCOUNT as string),

      leafOwner: new PublicKey(payer),
      leafDelegate: new PublicKey(payer),

      // other accounts
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      bubblegumSigner: bubblegumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: Object.assign(compressedNftMetadata, {
        collection: { key: new PublicKey(process.env.CHATGPT_COLLECTION_MINT as string), verified: false },
      }),
    }
  );

  const tx = new Transaction();
  tx.add(mintToCollectionIx);
  tx.feePayer = new PublicKey(payer);
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;
  tx.partialSign(collectionOwner);
  return {
    transaction: tx.serialize({ requireAllSignatures: false }).toString("base64"),
  };
}
export default makeRespondToSolanaPayGet(makeRespondToSolanaPayPost(createMintCNFT));