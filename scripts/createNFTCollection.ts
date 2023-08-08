import {
  Metaplex,
  toMetaplexFile,
  UploadMetadataInput,
} from "@metaplex-foundation/js";
import { Keypair, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createAccount, createMint, mintTo } from "@solana/spl-token";
import { savePublicKeyToFile } from "./helper";

import {
  PublicKey,
} from "@metaplex-foundation/js";

import {
  CreateMetadataAccountArgsV3,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV3Instruction,
  createSetCollectionSizeInstruction,
} from "@metaplex-foundation/mpl-token-metadata";
import * as fs from "fs";
import { CONNECTION } from "../chatgpt-plugin/src/pages/api/constants";
import dotenv from "dotenv";
dotenv.config();

export async function createNFTCollection(
  payer: Keypair,
  metaplex: Metaplex,
) {
  // Create collection metadata
  const buffer = fs.readFileSync(`../assets/chatgpt-collection-logo.png`);
  const file = toMetaplexFile(buffer, `chatgpt-collection-logo.png`);
  const imageUri = await metaplex.storage().upload(file);

  const data = fs.readFileSync("./collection-metadata.json", "utf-8");
  const collectionInfo = JSON.parse(data);

  const collectionMetadata: UploadMetadataInput = {
    name: collectionInfo.name,
    symbol: collectionInfo.symbol,
    image: imageUri,
    description: collectionInfo.description,
  };
  const { uri } = await metaplex.nfts().uploadMetadata(collectionMetadata);

  // Create collection
  const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
    data: {
      name: `${collectionMetadata.name ?? ""} Collection`,
      symbol: `${collectionMetadata.symbol ?? ""}`,
      uri,
      sellerFeeBasisPoints: 100,
      creators: [
        {
          address: payer.publicKey,
          verified: true,
          share: 100,
        },
      ],
      collection: null,
      uses: null,
    },
    isMutable: false,
    collectionDetails: null,
  };

  const collectionMint = await createMint(
    CONNECTION,
    payer,
    payer.publicKey, // mintAuthority
    payer.publicKey, // freezeAuthority
    0 // collection -> decimal == 0
  )

  const tokenAccount = await createAccount(
    CONNECTION,
    payer,
    collectionMint,
    payer.publicKey,
  );

  await mintTo(CONNECTION, payer, collectionMint, tokenAccount, payer, 1, [], undefined, TOKEN_PROGRAM_ID);

  const [collectionMetadataAccount, _bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata", "utf8"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), collectionMint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID,
  )

  const createMetadataIx = createCreateMetadataAccountV3Instruction(
    {
      metadata: collectionMetadataAccount,
      mint: collectionMint,
      mintAuthority: payer.publicKey,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey,
    },
    {
      createMetadataAccountArgsV3: collectionMetadataV3,
    }
  )

  // create account for showing supply of collection metadata, the proof of the Non-Fungible of the token
  const [collectionMasterEditionAccount, _bump2] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata", "utf8"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), collectionMint.toBuffer(), Buffer.from("edition", "utf8")],
    TOKEN_METADATA_PROGRAM_ID,
  )

  const createMasterEditionIx = createCreateMasterEditionV3Instruction(
    {
      edition: collectionMasterEditionAccount,
      payer: payer.publicKey,
      mint: collectionMint,
      mintAuthority: payer.publicKey,
      updateAuthority: payer.publicKey,
      metadata: collectionMetadataAccount,
    },
    {
      createMasterEditionArgs: {
        maxSupply: 0,
      }
    }
  )

  // create collection size
  const collectionSizeIx = createSetCollectionSizeInstruction(
    {
      collectionMetadata: collectionMetadataAccount,
      collectionAuthority: payer.publicKey,
      collectionMint: collectionMint,
    },
    {
      setCollectionSizeArgs: { size: 1000000 }
    }
  )

  try {
    const tx = new Transaction();
    tx.add(createMetadataIx);
    tx.add(createMasterEditionIx);
    tx.add(collectionSizeIx);

    tx.feePayer = payer.publicKey;
    // tx.sign(payer); ??

    await sendAndConfirmTransaction(
      CONNECTION,
      tx,
      [payer],
      {
        commitment: "confirmed",
        skipPreflight: true //?
      }
    )
  } catch (e) {
    console.error("\nFailed to create collection:", e);
    throw e;
  }
  savePublicKeyToFile("collectionMint", collectionMint);
  savePublicKeyToFile("collectionMetadataAccount", collectionMetadataAccount);
  savePublicKeyToFile("collectionMasterEditionAccount", collectionMasterEditionAccount);
  console.log("Collection Address: ", collectionMint.toBase58())
  return { collectionMint, collectionMetadataAccount, collectionMasterEditionAccount }
}