import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
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
import { CONNECTION } from "../../../constants";

import dotenv from "dotenv";
import { NextApiRequest } from "next";
import { loadPublicKeysFromFile } from "../utils/helpers";
import { error } from "console";
dotenv.config();
import {readFileSync} from "fs";

export async function createMintCNFT(
  req: NextApiRequest
) {
  const treeAddressesData = JSON.parse(readFileSync("./assets/public-tree-addresses.json", "utf8"))["publicTreeAddresses"]
  const publicTreeAddresses: PublicKey[] = treeAddressesData["publicTreeAddresses"].map((treeAddress: string) => new PublicKey(treeAddress));
  console.log("publicTreeAddresses", publicTreeAddresses)
  
  const { metadataUri, treeAddress = publicTreeAddresses[0] } = req.query;
  const { account: payer } = req.body;

  //TODO: decisions to take regarding these
  const treeAuthority = payer.publicKey;
  // loadPublicKeysFromFile();
  let keys = loadPublicKeysFromFile();
  if (
    !keys?.collectionMint ||
    !keys?.collectionMetadataAccount ||
    !keys?.collectionMasterEditionAccount
  ) {
    throw error("Please create a collection first and save the keys in the assets");
  }
  
  const metaplex = Metaplex.make(CONNECTION);
  // create compressed nft
  //TODO: get the nft metadata details from metaplex
  console.log("reached before fetching the nft metadata")
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
        address: payer.publicKey,
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

  // const receiverAddress = payer.publicKey;
  // derive PDA (owned bt Bubblegum) to act as the signer of the compressed minting
  const [bubblegumSigner, _bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID
  );

  const mintToCollectionIx = createMintToCollectionV1Instruction(
    {
      payer: payer.publicKey,

      merkleTree: treeAddress as PublicKey,
      treeAuthority: treeAuthority,
      treeDelegate: payer.publicKey,

      collectionMint: keys.collectionMint,
      collectionAuthority: payer.publicKey,
      collectionMetadata: keys.collectionMetadataAccount,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      editionAccount: keys.collectionMasterEditionAccount,

      leafOwner: payer.publicKey,
      leafDelegate: payer.publicKey,

      // other accounts
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      bubblegumSigner: bubblegumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: Object.assign(compressedNftMetadata, {
        collection: { key: keys.collectionMint, verified: false },
      }),
    }
  );
  const tx = new Transaction();
  tx.add(mintToCollectionIx);
  return tx;
  // try {
  //   const tx = new Transaction();
  //   tx.add(mintToCollectionIx);
  //   return tx;

  // } catch (e) {
  //   console.error(e);
  //   throw e;
  // }

}