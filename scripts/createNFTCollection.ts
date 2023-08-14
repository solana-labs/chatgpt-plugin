import {
  Metaplex,
  toMetaplexFile,
  UploadMetadataInput,
} from "@metaplex-foundation/js";
import {
  createAssociatedTokenAccount,
  createMint,
  mintTo,
} from "@solana/spl-token";
import {
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { savePublicKeyToFile } from "./helper";

import { PublicKey } from "@metaplex-foundation/js";

import {
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV3Instruction,
  CreateMetadataAccountArgsV3,
  createSetCollectionSizeInstruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import * as fs from "fs";

import dotenv from "dotenv";
dotenv.config();

const ASSETS_DIR = "../chatgpt-plugin/public/assets/";
export async function createNFTCollection(payer: Keypair, metaplex: Metaplex) {
  console.log(metaplex.connection);
  // Create collection metadata
  const buffer = fs.readFileSync(`${ASSETS_DIR}chatgpt-collection-logo.png`);
  const file = toMetaplexFile(buffer, `chatgpt-collection-logo.png`);
  console.log("before Uploading file to Metaplex");
  const imageUri = await metaplex.storage().upload(file);
  console.log("after Uploading file to Metaplex");
  const data = fs.readFileSync(
    `${ASSETS_DIR}chatgpt-collection-metadata.json`,
    "utf-8"
  );
  const collectionInfo = JSON.parse(data);

  const collectionMetadata: UploadMetadataInput = {
    name: collectionInfo.name,
    symbol: collectionInfo.symbol,
    image: imageUri,
    description: collectionInfo.description,
  };
  console.log("before Uploading metadata to Metaplex");
  const { uri } = await metaplex.nfts().uploadMetadata(collectionMetadata);
  console.log("after Uploading metadata to Metaplex");
  // Create collection
  const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
    data: {
      name: `${collectionMetadata.name ?? ""}`,
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
  console.log("before creating mint");
  const collectionMint = await createMint(
    metaplex.connection,
    payer,
    payer.publicKey, // mintAuthority
    payer.publicKey, // freezeAuthority
    0 // collection -> decimal == 0
  );
  console.log("before creating account");
  // const tokenAccount = await createAccount(
  //   metaplex.connection,
  //   payer,
  //   collectionMint,
  //   payer.publicKey,
  // );
  console.log(collectionMint.toString());
  const tokenAccount = await createAssociatedTokenAccount(
    metaplex.connection,
    payer,
    collectionMint,
    payer.publicKey,
    { commitment: "confirmed" }
  );

  console.log("before minting");
  await mintTo(
    metaplex.connection,
    payer,
    collectionMint,
    tokenAccount,
    payer,
    1,
    [],
    { commitment: "confirmed" }
  );
  console.log("after minting");
  const [collectionMetadataAccount, _bump] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata", "utf8"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

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
  );

  // create account for showing supply of collection metadata, the proof of the Non-Fungible of the token
  const [collectionMasterEditionAccount, _bump2] =
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata", "utf8"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        collectionMint.toBuffer(),
        Buffer.from("edition", "utf8"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

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
      },
    }
  );

  // create collection size
  const collectionSizeIx = createSetCollectionSizeInstruction(
    {
      collectionMetadata: collectionMetadataAccount,
      collectionAuthority: payer.publicKey,
      collectionMint: collectionMint,
    },
    {
      setCollectionSizeArgs: { size: 1000000 },
    }
  );

  try {
    const tx = new Transaction();
    tx.add(createMetadataIx);
    tx.add(createMasterEditionIx);
    tx.add(collectionSizeIx);

    tx.feePayer = payer.publicKey;
    // tx.sign(payer); ??

    await sendAndConfirmTransaction(metaplex.connection, tx, [payer], {
      commitment: "confirmed",
      skipPreflight: true, //?
    });
  } catch (e) {
    console.error("\nFailed to create collection:", e);
    throw e;
  }
  savePublicKeyToFile(
    "collectionMint",
    collectionMint,
    `${ASSETS_DIR}/chatgpt-collection-keys.json`
  );
  savePublicKeyToFile(
    "collectionMetadataAccount",
    collectionMetadataAccount,
    `${ASSETS_DIR}chatgpt-collection-keys.json`
  );
  savePublicKeyToFile(
    "collectionMasterEditionAccount",
    collectionMasterEditionAccount,
    `${ASSETS_DIR}chatgpt-collection-keys.json`
  );
  console.log("Collection Mint Address: ", collectionMint.toBase58());
  console.log(
    "Collection Metadata Address: ",
    collectionMetadataAccount.toBase58()
  );
  console.log(
    "Collection Master Edition Address: ",
    collectionMasterEditionAccount.toBase58()
  );
  return {
    collectionMint,
    collectionMetadataAccount,
    collectionMasterEditionAccount,
  };
}
