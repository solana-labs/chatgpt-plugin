import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import {
  Metaplex
} from "@metaplex-foundation/js";
import * as fs from "fs";
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
dotenv.config();


export async function createMintCNFT(
  req: NextApiRequest
) {
  const { metadataUri, amount } = req.query;
  const { account: payer } = req.body;
  //TODO: decisions to take regarding these
  const treeAddress;
  const treeAuthority;
  const collectionMint;
  const collectionMetadataAccount;
  const collectionMasterEditionAccount;




  
  const metaplex = Metaplex.make(CONNECTION);
  //   .use(keypairIdentity(payer))
  //   .use(
  //     bundlrStorage({
  //       address: "https://devnet.bundlr.network",
  //       providerUrl: "https://api.devnet.solana.com",
  //       timeout: 60000,
  //     })
  //   );

  // // create nft metadata
  // const buffer = fs.readFileSync(`./src/assets/${nonce}.${EXTENSION}`);
  // const file = toMetaplexFile(buffer, `${nonce}.${EXTENSION}`);
  // const imageUri = await metaplex.storage().upload(file);

  // const data = fs.readFileSync("./src/collection.json", "utf-8");
  // const nftInfo = JSON.parse(data);

  // const nftMetadata: UploadMetadataInput = {
  //   name: `${nftInfo.name ?? "NFT"} #${nonce}`,
  //   symbol: `${nftInfo.symbol ?? "NFT"}`,
  //   description: "The Studious Dog are smart and productive dogs.",
  //   image: imageUri,
  //   properties: {
  //     files: [
  //       {
  //         uri: `${nonce}.${EXTENSION}`,
  //         type: `image/${EXTENSION}`,
  //       },
  //     ],
  //   },
  // };
  // const { uri } = await metaplex.nfts().uploadMetadata(nftMetadata);

  // create compressed nft
  //TODO: get the nft metadata details from metaplex
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

  const receiverAddress = payer.publicKey;
  // derive PDA (owned bt Bubblegum) to act as the signer of the compressed minting
  const [bubblegumSigner, _bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi", "utf8")],
    BUBBLEGUM_PROGRAM_ID
  );

  const mintToCollectionIx = createMintToCollectionV1Instruction(
    {
      payer: payer.publicKey,

      merkleTree: treeAddress,
      treeAuthority: treeAuthority,
      treeDelegate: payer.publicKey,

      collectionMint: collectionMint,
      collectionAuthority: payer.publicKey,
      collectionMetadata: collectionMetadataAccount,
      collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
      editionAccount: collectionMasterEditionAccount,

      leafOwner: receiverAddress,
      leafDelegate: payer.publicKey,

      // other accounts
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      bubblegumSigner: bubblegumSigner,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    },
    {
      metadataArgs: Object.assign(compressedNftMetadata, {
        collection: { key: collectionMint, verified: false },
      }),
    }
  );

  try {
    const tx = new Transaction();
    tx.add(mintToCollectionIx);
    return tx;
    // const txSig = await sendAndConfirmTransaction(
    //   connection,
    //   tx,
    //   [payer],
    //   {
    //     commitment: "confirmed",
    //     skipPreflight: false,
    //   }
    // )

  } catch (e) {
    console.error(e);
    throw e;
  }

}