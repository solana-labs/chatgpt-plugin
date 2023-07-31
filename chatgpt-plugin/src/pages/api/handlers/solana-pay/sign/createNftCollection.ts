import { NextApiRequest } from "next";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  UploadMetadataInput,
} from "@metaplex-foundation/js";
import { ConfirmOptions, Keypair, Connection, Transaction, SystemProgram, sendAndConfirmTransaction, TransactionInstruction } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createAccount, mintTo } from "@solana/spl-token";
// import { savePublicKeyToFile } from "../utils/helper";
import { CONNECTION } from "../../../constants";
import { getMinimumBalanceForRentExemptMint, MINT_SIZE, createInitializeMint2Instruction } from "@solana/spl-token";


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
import dotenv from "dotenv";
dotenv.config();

const EXTENSION = process.env.EXTENSION;

/**
 * Instructions to create and initialize a new mint
 *
 * @param connection      Connection to use
 * @param payer           Payer of the transaction and initialization fees
 * @param mintAuthority   Account or multisig that will control minting
 * @param freezeAuthority Optional account or multisig that can freeze token accounts
 * @param decimals        Location of the decimal place
 * @param keypair         Optional keypair, defaulting to a new random one
 * @param confirmOptions  Options for confirming the transaction
 * @param programId       SPL Token program account
 *
 * @return Address of the new mint
 */
export async function createMintIx(
  connection: Connection,
  payerPublicKey: PublicKey,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  decimals: number,
  keypair = Keypair.generate(),
  confirmOptions?: ConfirmOptions,
  programId = TOKEN_PROGRAM_ID
): Promise<TransactionInstruction[]> {
  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  return [
      SystemProgram.createAccount({
          fromPubkey: payerPublicKey,
          newAccountPubkey: keypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId,
      }),
      createInitializeMint2Instruction(keypair.publicKey, decimals, mintAuthority, freezeAuthority, programId),
    ];
}

export async function createNftCollection(req: NextApiRequest) {
  const metaplex = Metaplex.make(CONNECTION);
    // Parse info for creating collection
  const { account: payerPublicKey, sellerFee, collectionSize } = req.body; //TODO: if you need to get this from the body or the query

  // Create collection metadata
  const buffer = fs.readFileSync(`./src/assets/collection.${EXTENSION}`);
  const file = toMetaplexFile(buffer, `collection.${EXTENSION}`);
  const imageUri = await metaplex.storage().upload(file);

  const data = fs.readFileSync("./src/collection.json", "utf-8");
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
          address: payerPublicKey,
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

  // DOUBT: how to process multiple signed instructions, where results of the first is used later? 
  // DOUBT: should get the collectionMint here to be used in future transactions
  // const collectionMint = ;
  const collectionMintIx = await createMintIx(
    CONNECTION,
    payerPublicKey,
    payerPublicKey, // mintAuthority
    payerPublicKey, // freezeAuthority
    0 // collection -> decimal == 0
  )

  const tokenAccount = await createAccount(
    CONNECTION,
    payerPublicKey,
    collectionMint,
    payerPublicKey,
  );

  // await mintTo(CONNECTION, payer, collectionMint, tokenAccount, payer, 1, [], undefined, TOKEN_PROGRAM_ID);

  const [collectionMetadataAccount, _bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata", "utf8"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), collectionMint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID,
  )

  const createMetadataIx = createCreateMetadataAccountV3Instruction(
    {
      metadata: collectionMetadataAccount,
      mint: collectionMint,
      mintAuthority: payerPublicKey,
      payer: payerPublicKey,
      updateAuthority: payerPublicKey,
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
      payer: payerPublicKey,
      mint: collectionMint,
      mintAuthority: payerPublicKey,
      updateAuthority: payerPublicKey,
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
      collectionAuthority: payerPublicKey,
      collectionMint: collectionMint,
    },
    {
      setCollectionSizeArgs: { size: collectionSize }
    }
  )

  try {
    const tx = new Transaction();
    collectionMintIx.forEach((tempIx) => {
      tx.add(tempIx);
    });
    tx.add(createMetadataIx);
    tx.add(createMasterEditionIx);
    tx.add(collectionSizeIx);

    tx.feePayer = payerPublicKey;
    // should I partua
    tx.partialSign(payerPublicKey);
    return tx; 
    
  } catch (e) {
    console.error("\nFailed to create transactiion:", e);
    throw e;
  }
  
}


/*
// Code that could be useful to do the steps I have assumed are already done and as input arguments:
// Create collection metadata
    const buffer = fs.readFileSync(`./src/assets/collection.${EXTENSION}`);
    const file = toMetaplexFile(buffer, `collection.${EXTENSION}`);
    const imageUri = await metaplex.storage().upload(file);
    
    const data = fs.readFileSync("./src/collection.json", "utf-8");
    const collectionInfo = JSON.parse(data);
  
    const collectionMetadata: UploadMetadataInput = {
      name: collectionInfo.name,
      symbol: collectionInfo.symbol,
      image: imageUri,
      description: collectionInfo.description,
    };
    const { uri } = await metaplex.nfts().uploadMetadata(collectionMetadata);
    // savePublicKeyToFile("collectionMint", collectionMint);
  // savePublicKeyToFile("collectionMetadataAccount", collectionMetadataAccount);
  // savePublicKeyToFile("collectionMasterEditionAccount", collectionMasterEditionAccount);
  // console.log("Collection Address: ", collectionMint.toBase58())
  // return { collectionMint, collectionMetadataAccount, collectionMasterEditionAccount }
*/
