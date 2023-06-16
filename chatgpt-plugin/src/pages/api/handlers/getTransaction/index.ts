import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

import * as anchor from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { stringifyAnchorObject } from "../getAccountInfo";
import {
  ComputeBudgetInstruction,
  ComputeBudgetInstructionType,
  ComputeBudgetProgram,
  LAMPORTS_PER_SOL,
  SystemInstruction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, decodeInstruction } from "@solana/spl-token";

// Setup Solflare
import { Client } from "@solflare-wallet/utl-sdk";
const utl = new Client();

type IxArgs = Record<string, string>;

type Instruction = {
  programId: string;
  keys: string[];
  ixData: string | IxArgs;
  depth: number;
};

let PROGRAM_CACHE = new Map<string, anchor.Program | null>();

type ParsedTxResponse = {
  computeUnitsConsumed: number;
  feePayer: string;
  txFeeInLamports: number;
  txVersion: string;
  // TODO(ngundotra): I'm pretty sure amount needs to be a string bc u57 overflow...
  tokenBalanceChanges: Record<string, { mint: string; amount: number }>;
  solBalanceChanges: Record<string, number>;
  logs: string[];
  instructions: Instruction[];
};

async function getAnchorProgram(programId: string) {
  if (PROGRAM_CACHE.has(programId)) {
    return PROGRAM_CACHE.get(programId);
  }

  try {
    const program = await anchor.Program.at(
      programId,
      new anchor.AnchorProvider(CONNECTION, new NodeWallet(anchor.web3.Keypair.generate()), {}),
    );
    PROGRAM_CACHE.set(programId, program);
    return program;
  } catch (err) {
    PROGRAM_CACHE.set(programId, null);
    return null;
  }
}

async function parseAnchorIxData(programId: anchor.web3.PublicKey, ixData: string) {
  const program = await getAnchorProgram(programId.toString());
  if (!program) {
    return null;
  }
  let ixCoder = new anchor.BorshInstructionCoder(program.idl);
  return ixCoder.decode(Buffer.from(ixData, "base64"));
}

async function parseAnchorIxAccounts(
  programAddress: string,
  accounts: string[],
  ix: anchor.Instruction,
) {
  const program = await getAnchorProgram(programAddress);

  if (!program) {
    return null;
  }

  const ixDef = program?.idl.instructions.find((ixDef: any) => ixDef.name === ix.name);
  if (ixDef) {
    let parsedAccounts = ixDef.accounts as {
      // type coercing since anchor doesn't export the underlying type
      name: string;
      isMut: boolean;
      isSigner: boolean;
      pda?: object;
    }[];

    let allAccounts = parsedAccounts.map((acct, idx) => {
      return JSON.stringify({
        name: acct.name,
        isMut: acct.isMut,
        isSigner: acct.isSigner,
        address: accounts[idx],
      });
    });
    if (parsedAccounts && parsedAccounts.length < accounts.length) {
      allAccounts = allAccounts.concat(accounts.slice(parsedAccounts.length));
    }
    return allAccounts;
  }
  return null;
}

export function snakeToTitleCase(str: string): string {
  const result = str.replace(/([-_]\w)/g, g => ` ${g[1].toUpperCase()}`);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

async function parseAnchorIx(ix: Instruction) {
  let parsedIx = await parseAnchorIxData(
    new anchor.web3.PublicKey(ix.programId),
    ix.ixData as string,
  );
  if (!parsedIx) {
    return ix;
  }

  let parsedAccounts = await parseAnchorIxAccounts(ix.programId, ix.keys, parsedIx);

  let ixTitle = parsedIx.name;
  ixTitle = ixTitle.charAt(0).toUpperCase() + ixTitle.slice(1);
  let program = await getAnchorProgram(ix.programId);
  return {
    programId: `${snakeToTitleCase(program!.idl.name)} (${ix.programId})`,
    ixData: `${ixTitle} ${JSON.stringify(stringifyAnchorObject(parsedIx.data))}`,
    keys: parsedAccounts ?? ix.keys,
    depth: ix.depth,
  };
}

async function parseIx(ix: TransactionInstruction, depth: number): Promise<Instruction> {
  let programAddress = ix.programId.toBase58();

  let parsedIx: Instruction = {
    programId: programAddress,
    keys: ix.keys.map(k => k.pubkey.toBase58()),
    ixData: "",
    depth,
  };
  if (programAddress === SystemProgram.programId.toBase58()) {
    parsedIx.programId = "System Program";

    let type = SystemInstruction.decodeInstructionType(ix);
    switch (type) {
      case "AdvanceNonceAccount":
        parsedIx.ixData = stringifyAnchorObject({
          AdvanceNonceAccount: SystemInstruction.decodeNonceAdvance(ix),
        });
        break;
      case "Allocate":
        parsedIx.ixData = stringifyAnchorObject({
          Allocate: SystemInstruction.decodeAllocate(ix),
        });
        break;
      case "AllocateWithSeed":
        parsedIx.ixData = stringifyAnchorObject({
          AllocateWithSeed: SystemInstruction.decodeAllocateWithSeed(ix),
        });
        break;
      case "Assign":
        parsedIx.ixData = stringifyAnchorObject({ Assign: SystemInstruction.decodeAssign(ix) });
        break;
      case "AssignWithSeed":
        parsedIx.ixData = stringifyAnchorObject({
          AssignWithSeed: SystemInstruction.decodeAssignWithSeed(ix),
        });
        break;
      case "AuthorizeNonceAccount":
        parsedIx.ixData = stringifyAnchorObject({
          AuthorizeNonceAccount: SystemInstruction.decodeNonceAuthorize(ix),
        });
        break;
      case "Create":
        parsedIx.ixData = stringifyAnchorObject({
          Create: SystemInstruction.decodeCreateAccount(ix),
        });
        break;
      case "CreateWithSeed":
        parsedIx.ixData = stringifyAnchorObject({
          CreateWithSeed: SystemInstruction.decodeCreateWithSeed(ix),
        });
        break;
      case "InitializeNonceAccount":
        parsedIx.ixData = stringifyAnchorObject({
          InitializeNonceAccount: SystemInstruction.decodeNonceInitialize(ix),
        });
        break;
      case "Transfer":
        parsedIx.ixData = stringifyAnchorObject({ Transfer: SystemInstruction.decodeTransfer(ix) });
        break;
      case "TransferWithSeed":
        parsedIx.ixData = stringifyAnchorObject({
          TransferWithSeed: SystemInstruction.decodeTransferWithSeed(ix),
        });
        break;
      case "WithdrawNonceAccount":
        parsedIx.ixData = stringifyAnchorObject({
          WithdrawNonceAccount: SystemInstruction.decodeNonceWithdraw(ix),
        });
        break;
      case "UpgradeNonceAccount":
        break;
    }
  } else if (programAddress === TOKEN_2022_PROGRAM_ID.toBase58()) {
    parsedIx.programId = "SPL Token Program";
    let decoded = decodeInstruction(ix);
    // TODO(ngundotra): parse mint details
    parsedIx.ixData = stringifyAnchorObject(decoded);
  } else if (programAddress === TOKEN_PROGRAM_ID.toBase58()) {
    parsedIx.programId = "SPL Token Program 2022";
    let decoded = decodeInstruction(ix);
    // TODO(ngundotra): parse mint details
    parsedIx.ixData = stringifyAnchorObject(decoded);
  } else if (programAddress === ComputeBudgetProgram.programId.toBase58()) {
    parsedIx.programId = "Compute Budget Program";
    let type: ComputeBudgetInstructionType = ComputeBudgetInstruction.decodeInstructionType(ix);

    switch (type) {
      case "RequestHeapFrame":
        parsedIx.ixData = stringifyAnchorObject({
          RequestHeapFrame: ComputeBudgetInstruction.decodeRequestHeapFrame(ix),
        });
        break;
      case "RequestUnits":
        parsedIx.ixData = stringifyAnchorObject({
          RequestUnits: ComputeBudgetInstruction.decodeRequestUnits(ix),
        });
        break;
      case "SetComputeUnitLimit":
        parsedIx.ixData = stringifyAnchorObject({
          SetComputeUnitLimit: ComputeBudgetInstruction.decodeSetComputeUnitLimit(ix),
        });
        break;
      case "SetComputeUnitPrice":
        parsedIx.ixData = stringifyAnchorObject({
          SetComputeUnit: ComputeBudgetInstruction.decodeSetComputeUnitPrice(ix),
        });
        break;
    }
  } else {
    return await parseAnchorIx({
      programId: programAddress,
      ixData: anchor.utils.bytes.base64.encode(ix.data),
      keys: ix.keys.map(k => k.pubkey.toBase58()),
      depth,
    });
  }
  return parsedIx;
}

async function parseTokenChanges(
  preBalances: anchor.web3.ConfirmedTransactionMeta["preTokenBalances"],
  postBalances: anchor.web3.ConfirmedTransactionMeta["postTokenBalances"],
) {
  let mints = new Set([...preBalances!.map(b => b.mint), ...postBalances!.map(b => b.mint)]);
  let mintData = await utl.fetchMints(
    Array.from(mints.keys()).map(k => new anchor.web3.PublicKey(k)),
  );
  let mintMap: Record<string, string> = {};
  mintData
    .filter(token => token.verified ?? true)
    .forEach(m => {
      mintMap[m.address.toString()] = m.symbol;
    });

  if (!postBalances || !preBalances || postBalances.length != preBalances.length) {
    return null;
  }

  let changes: Record<string, { mint: string; amount: number }> = {};
  for (let i = 0; i < postBalances?.length; i++) {
    let pre = preBalances[i];
    let post = postBalances[i];
    let tokenChange = (post.uiTokenAmount.uiAmount ?? 0) - (pre.uiTokenAmount.uiAmount ?? 0);
    changes[pre.owner!] = { mint: mintMap[pre.mint] ?? pre.mint, amount: tokenChange };
  }
  return changes;
}

function parseSolChanges(
  accounts: anchor.web3.PublicKey[],
  preBalances: number[],
  postBalances: number[],
) {
  if (preBalances.length != postBalances.length) {
    return null;
  }
  const changes: Record<string, number> = {};
  for (let i = 0; i < preBalances.length; i++) {
    let pre = preBalances[i];
    let post = postBalances[i];
    let solChange = post - pre;
    if (solChange > 0.0000000001) {
      changes[accounts[i].toString()] = solChange / LAMPORTS_PER_SOL;
    }
  }
  return changes;
}

function parseLogs(logs: string[]): { programId: string; depth: number }[] {
  let traces: { programId: string; depth: number }[] = [];
  for (const log of logs) {
    let match = log.match(/Program (.*) invoke \[(.*)\]/);
    if (match) {
      let program = match[1];
      let depth = match[2];
      traces.push({ programId: program, depth: Number.parseInt(depth) });
    }
  }
  return traces;
}

// TODO(ngundotra): add support for System program + SPL programs
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.body.signature;
  const transaction = await CONNECTION.getTransaction(signature, {
    maxSupportedTransactionVersion: 2,
  });

  if (!transaction) {
    res.status(404).send("Transaction not found");
  }

  let instructions: Instruction[] = [];

  // Reconstruct account array
  let accounts = transaction?.transaction.message.staticAccountKeys ?? [];
  accounts = accounts.concat(transaction?.meta?.loadedAddresses?.readonly ?? []);
  accounts = accounts.concat(transaction?.meta?.loadedAddresses?.writable ?? []);

  let tokenBalanceChanges = await parseTokenChanges(
    transaction?.meta?.preTokenBalances,
    transaction?.meta?.postTokenBalances,
  );
  let solChanges = parseSolChanges(
    accounts,
    transaction?.meta?.preBalances ?? [],
    transaction?.meta?.postBalances ?? [],
  );

  // Keep track of order of instructions (may not be able get stack depth for each inner ix because of log truncation)
  let traceIdx = 0;
  let parsedTrace = parseLogs(transaction?.meta?.logMessages ?? []);

  // Loop through top-level instructions
  let outerIdx = 0;
  let innerIdx = 0;
  for (const outerIx of transaction?.transaction.message.compiledInstructions ?? []) {
    const programId = accounts[outerIx.programIdIndex];
    instructions.push(
      await parseIx(
        {
          programId,
          data: Buffer.from(outerIx.data ?? []),
          keys: outerIx.accountKeyIndexes.map(idx => {
            return {
              pubkey: accounts[idx],
              isSigner: false,
              isWritable: false,
            };
          }),
        },
        0,
      ),
    );
    traceIdx += 1;

    // Loop through inner instructions
    let innerIxBucket = transaction?.meta?.innerInstructions?.[innerIdx];
    if (innerIxBucket && innerIxBucket.index === outerIdx) {
      for (const innerIx of innerIxBucket.instructions) {
        if (parsedTrace[traceIdx].programId !== accounts[innerIx.programIdIndex].toBase58()) {
          // Make a note that the depth is unknown (somehow)
          parsedTrace[traceIdx].depth = 1;
        }

        instructions.push(
          await parseIx(
            {
              programId: accounts[innerIx.programIdIndex],
              keys: innerIx.accounts.map(key => {
                return {
                  pubkey: accounts[key],
                  isSigner: false,
                  isWritable: false,
                };
              }),
              data: anchor.utils.bytes.bs58.decode(innerIx.data),
            },
            parsedTrace[traceIdx].depth,
          ),
        );
        traceIdx += 1;
      }
      innerIdx += 1;
    }

    outerIdx += 1;
  }
  const feePayer = transaction?.transaction.message.staticAccountKeys[0]!.toBase58();

  let response: ParsedTxResponse = {
    txFeeInLamports: transaction?.meta?.fee!,
    computeUnitsConsumed: transaction?.meta?.computeUnitsConsumed!,
    txVersion: JSON.stringify(transaction?.version) ?? "legacy",
    logs: transaction?.meta?.logMessages ?? [],
    feePayer: feePayer!,
    instructions,
    tokenBalanceChanges: tokenBalanceChanges!,
    solBalanceChanges: solChanges!,
  };

  res.status(200).send(JSON.stringify(response));
}
