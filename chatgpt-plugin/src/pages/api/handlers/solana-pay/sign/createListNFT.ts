/**
 * Deprecated because Solana Pay compatible wallets block NFT/token delegation to prevent scams
 * This means we can't list via Solana Pay, but maybe we can get around this by using NFT AMMs
 * to sell at the floor.
 */
import { NextApiRequest } from "next";

import configConstants, { CONNECTION } from "../../../constants";
configConstants();

import { makeRespondToSolanaPayPost, makeRespondToSolanaPayGet } from ".";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";

import {
  Hyperspace,
  hyperspaceIdl,
} from "../../../../../app/hyperspace/idl/hyperspace";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import {
  findTokenRecordPda,
  getAtaForMint,
  getEditionDataAccount,
  getHyperspaceProgramAsSigner,
  getHyperspaceTradeState,
  getMetadata,
} from "@/app/hyperspace/account";
import { TOKEN_PROGRAM_ID, getAccount } from "@solana/spl-token";
import {
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  HYPERSPACE_ID,
  HYPERSPACE_MARKETPLACE_INSTANCE,
} from "@/app/hyperspace/constants";

const AUTH_PROGRAM_ID = new PublicKey(
  "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg"
);

// async function hyperspaceCreateListTx(
//   seller: string,
//   token: string,
//   price: number
// ) {
//   console.log(seller, token, price);
//   let transactionData = await HYPERSPACE_CLIENT.createListTx({
//     sellerAddress: seller,
//     tokenAddress: token,
//     price: price,
//     // Take no fee on making tx for ChatGPT users
//     sellerBroker: "",
//     sellerBrokerBasisPoints: 0,
//   });

//   console.log(transactionData);
//   const txBytes = base64.encode(
//     Buffer.from(transactionData.createListTx.stdBuffer!)
//   );
//   console.log(txBytes);

//   return {
//     transaction: txBytes,
//   };
// }

export const getPriceWithMantissa = async (
  price: number,
  mint: PublicKey,
  walletKeyPair: any,
  anchorProgram: Program<Hyperspace>
): Promise<number> => {
  // // const token = new Token(
  // //   anchorProgram.provider.connection,
  // //   new PublicKey(mint),
  // //   TOKEN_PROGRAM_ID,
  // //   walletKeyPair
  // // );

  // let ata = getAssociatedTokenAddressSync(mint, walletKeypair);

  // const mintInfo = await token.getMintInfo();

  // const mantissa = 10 ** mintInfo.decimals;

  // return Math.ceil(price * mantissa);
  return 1;
};

async function createTradeStateInstruction(
  anchorProgram: Program<Hyperspace>,
  isBuy: boolean,
  tradeBump: number,
  buyPrice: BN,
  brokerBasisPoints: number,
  royalty_basis_points = 0,
  tokenSize: BN,
  user: PublicKey,
  broker: PublicKey,
  tokenAccount: PublicKey,
  tokenMint: PublicKey,
  tradeStateAddress: PublicKey
): Promise<TransactionInstruction> {
  console.log(`Create instruction for creating trade state with address ${tradeStateAddress}
      for ${user.toBase58()} (broker: ${broker.toBase58()}, basis points: ${brokerBasisPoints})
      for token ${tokenMint.toBase58()} at price ${buyPrice}`);
  let instruction = anchorProgram.instruction.createTradeState(
    isBuy ? 1 : 0,
    tradeBump,
    buyPrice,
    brokerBasisPoints,
    tokenSize,
    royalty_basis_points,
    {
      accounts: {
        wallet: user,
        collection: HYPERSPACE_ID,
        brokerWallet: broker,
        tokenAccount: tokenAccount,
        tokenMint: tokenMint,
        tradeState: tradeStateAddress,
        systemProgram: SystemProgram.programId,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
    }
  );
  instruction.keys
    .filter((k) => k.pubkey.equals(user))
    .map((k) => (k.isSigner = true));
  return instruction;
}

async function helper(
  anchorProgram: Program<Hyperspace>,
  seller: PublicKey,
  mintPublicKey: PublicKey,
  sellerBrokerKey: PublicKey,
  minAmountToReceive: BN,
  // We don't charge for creating this
  brokerBasisPoints: number = 0,
  // This only matters when you cross
  royaltyBasisPoints: number = 0
) {
  const tokenSizeAdjusted = new BN(
    await getPriceWithMantissa(1, mintPublicKey, seller, anchorProgram)
  );

  const tokenAccountKey = (await getAtaForMint(mintPublicKey, seller))[0];

  // You should check that ATA exists
  let instructions: TransactionInstruction[] = [];

  const [programAsSigner, programAsSignerBump] =
    await getHyperspaceProgramAsSigner();

  const [tradeState, tradeBump] = await getHyperspaceTradeState(
    false,
    seller,
    tokenAccountKey,
    mintPublicKey,
    tokenSizeAdjusted
  );

  const tradeStateAccount =
    await anchorProgram.provider.connection.getAccountInfo(
      tradeState,
      "confirmed"
    );

  if (!tradeStateAccount) {
    const initTradeStateInstruction = await createTradeStateInstruction(
      anchorProgram,
      false,
      tradeBump,
      minAmountToReceive,
      brokerBasisPoints,
      royaltyBasisPoints,
      tokenSizeAdjusted,
      seller,
      sellerBrokerKey,
      tokenAccountKey,
      mintPublicKey,
      tradeState
    );
    instructions.push(initTradeStateInstruction);
  }

  const tokenRecord = findTokenRecordPda(mintPublicKey, tokenAccountKey);

  const editionAccount = (await getEditionDataAccount(mintPublicKey))[0];

  const metadataAccount = await getMetadata(mintPublicKey);

  const metadataObj = await anchorProgram.provider.connection.getAccountInfo(
    metadataAccount,
    "confirmed"
  );

  if (!metadataObj) {
    throw Error(
      "NFT does not have a metadata account, it may have been burnt."
    );
  }
  const metadataParsed = Metadata.deserialize(metadataObj.data)[0];

  const signers: Keypair[] = [];

  let marketplaceObj = await anchorProgram.account.hyperspace.fetch(
    HYPERSPACE_MARKETPLACE_INSTANCE
  );

  const sellInstruction = await anchorProgram.instruction.sell(
    tradeBump,
    programAsSignerBump,
    minAmountToReceive,
    brokerBasisPoints,
    tokenSizeAdjusted,
    royaltyBasisPoints,
    {
      accounts: {
        wallet: seller,
        sellerBrokerWallet: sellerBrokerKey,
        tokenMint: mintPublicKey,
        tokenAccount: tokenAccountKey,
        metadata: metadataAccount,
        authority: marketplaceObj.authority,
        hyperspace: HYPERSPACE_MARKETPLACE_INSTANCE,
        hyperspaceFeeAccount: marketplaceObj.hyperspaceFeeAccount,
        sellerTradeState: tradeState,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        metadataProgram: TOKEN_METADATA_PROGRAM_ID,
        programAsSigner: programAsSigner,
        instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenRecord: tokenRecord,
        editionAccount: editionAccount,
        authorizationRules: metadataParsed.programmableConfig?.ruleSet
          ? metadataParsed.programmableConfig.ruleSet
          : TOKEN_METADATA_PROGRAM_ID,
        mplTokenAuthRulesProgram: AUTH_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
      },
      signers,
    }
  );
  instructions.push(sellInstruction);
  return instructions;
}

async function hyperspaceCreateListTx(
  seller: string,
  token: string,
  price: number
) {
  let provider = new AnchorProvider(
    CONNECTION,
    new NodeWallet(Keypair.generate()),
    {}
  );
  let program = new Program(hyperspaceIdl, HYPERSPACE_ID, provider);
  const sellerKey = new PublicKey(seller);

  const tokenKey = new PublicKey(token);
  let mint: PublicKey;
  try {
    const tokenAI = await getAccount(CONNECTION, tokenKey);
    console.log("found tokenAI:", tokenAI);
    mint = tokenAI.mint;
  } catch (e) {
    mint = tokenKey;
  }

  let instructions = await helper(
    program,
    sellerKey,
    mint,
    SystemProgram.programId,
    new BN(price * LAMPORTS_PER_SOL)
  );

  let tx = new Transaction();
  for (const ix of instructions) {
    tx = tx.add(ix);
  }
  tx.recentBlockhash = (await CONNECTION.getLatestBlockhash()).blockhash;
  tx.feePayer = sellerKey;

  const txBytes = tx
    .serialize({ requireAllSignatures: false })
    .toString("base64");

  return {
    transaction: txBytes,
  };
}

export async function createListNFT(req: NextApiRequest) {
  const { token, price } = req.query;
  const { account: seller } = req.body;
  console.log(seller, token, price);
  return await hyperspaceCreateListTx(
    seller as string,
    token as string,
    Number.parseFloat(price as string)
  );
}

export default makeRespondToSolanaPayGet(
  makeRespondToSolanaPayPost(createListNFT)
);
