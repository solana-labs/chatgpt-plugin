import { Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  HYPERSPACE,
  FEE_PAYER,
  HYPERSPACE_ID as MARKETPLACE_PROGRAM_ID,
} from "./constants";
import { hyperspaceIdl } from "./idl/hyperspace";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID as SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
} from "@solana/spl-token";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";

export async function loadHyperspaceProgram(
  anchorWallet: any,
  connection: anchor.web3.Connection
) {
  const provider = new AnchorProvider(connection, anchorWallet, {
    preflightCommitment: "recent",
  });
  return new anchor.Program(hyperspaceIdl, MARKETPLACE_PROGRAM_ID, provider);
}

export const getHyperspaceBuyerEscrow = async (
  auctionHouse: anchor.web3.PublicKey,
  wallet: anchor.web3.PublicKey
): Promise<[PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(HYPERSPACE), auctionHouse.toBuffer(), wallet.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
};

export const getHyperspaceTradeState = async (
  is_buy: boolean,
  wallet: anchor.web3.PublicKey,
  tokenAccount: anchor.web3.PublicKey,
  tokenMint: anchor.web3.PublicKey,
  tokenSize: anchor.BN
): Promise<[PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(HYPERSPACE),
      is_buy
        ? new anchor.BN(1).toArrayLike(Buffer, "le", 1)
        : new anchor.BN(0).toArrayLike(Buffer, "le", 1),
      wallet.toBuffer(),
      tokenAccount.toBuffer(),
      tokenMint.toBuffer(),
      tokenSize.toArrayLike(Buffer, "le", 8),
    ],
    MARKETPLACE_PROGRAM_ID
  );
};

export const getMetadata = async (
  mint: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

export const getHyperspace = async (
  creator: anchor.web3.PublicKey
): Promise<[PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(HYPERSPACE), creator.toBuffer()],
    MARKETPLACE_PROGRAM_ID
  );
};

export const getHyperspaceFeeAcct = async (
  auctionHouse: anchor.web3.PublicKey
): Promise<[PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(HYPERSPACE), auctionHouse.toBuffer(), Buffer.from(FEE_PAYER)],
    MARKETPLACE_PROGRAM_ID
  );
};

export const getAtaForMint = async (
  mint: anchor.web3.PublicKey,
  buyer: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

export const getEditionDataAccount = async (
  mint: anchor.web3.PublicKey
): Promise<[anchor.web3.PublicKey, number]> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
};

export const getHyperspaceProgramAsSigner = async (): Promise<
  [PublicKey, number]
> => {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(HYPERSPACE), Buffer.from("signer")],
    MARKETPLACE_PROGRAM_ID
  );
};

export const findTokenRecordPda = (
  mint: PublicKey,
  token: PublicKey
): PublicKey => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("token_record"),
      token.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
};
