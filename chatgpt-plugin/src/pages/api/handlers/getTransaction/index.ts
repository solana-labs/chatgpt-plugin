import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

import * as anchor from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { program } from "@coral-xyz/anchor/dist/cjs/native/system";
import { stringifyAnchorObject } from "../getAccountInfo";

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
      new anchor.AnchorProvider(
        CONNECTION,
        new NodeWallet(anchor.web3.Keypair.generate()),
        {}
      )
    );
    PROGRAM_CACHE.set(programId, program);
    return program;
  } catch (err) {
    PROGRAM_CACHE.set(programId, null);
    return null;
  }
}

async function parseAnchorIxData(
  programId: anchor.web3.PublicKey,
  ixData: string
) {
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
  ix: anchor.Instruction
) {
  const program = await getAnchorProgram(programAddress);

  if (!program) {
    return null;
  }

  const ixDef = program?.idl.instructions.find(
    (ixDef: any) => ixDef.name === ix.name
  );
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
  const result = str.replace(/([-_]\w)/g, (g) => ` ${g[1].toUpperCase()}`);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

async function parseAnchorIx(ix: Instruction) {
  let parsedIx = await parseAnchorIxData(
    new anchor.web3.PublicKey(ix.programId),
    ix.ixData as string
  );
  if (!parsedIx) {
    return ix;
  }

  let parsedAccounts = await parseAnchorIxAccounts(
    ix.programId,
    ix.keys,
    parsedIx
  );

  let ixTitle = parsedIx.name;
  ixTitle = ixTitle.charAt(0).toUpperCase() + ixTitle.slice(1);
  let program = await getAnchorProgram(ix.programId);
  return {
    programId: `${snakeToTitleCase(program!.idl.name)} (${ix.programId})`,
    ixData: `${ixTitle} ${JSON.stringify(
      stringifyAnchorObject(parsedIx.data)
    )}`,
    keys: parsedAccounts ?? ix.keys,
    depth: ix.depth,
  };
}

function parseTokenChanges(
  preBalances: anchor.web3.ConfirmedTransactionMeta["preTokenBalances"],
  postBalances: anchor.web3.ConfirmedTransactionMeta["postTokenBalances"]
) {
  if (
    !postBalances ||
    !preBalances ||
    postBalances.length != preBalances.length
  ) {
    return null;
  }

  let changes: Record<string, { mint: string; amount: number }> = {};
  for (let i = 0; i < postBalances?.length; i++) {
    let pre = preBalances[i];
    let post = postBalances[i];
    let tokenChange =
      (post.uiTokenAmount.uiAmount ?? 0) - (pre.uiTokenAmount.uiAmount ?? 0);
    changes[pre.owner!] = { mint: pre.mint, amount: tokenChange };
  }
  return changes;
}

function parseSolChanges(
  accounts: anchor.web3.PublicKey[],
  preBalances: number[],
  postBalances: number[]
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
      changes[accounts[i].toString()] = solChange;
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
  accounts = accounts.concat(
    transaction?.meta?.loadedAddresses?.readonly ?? []
  );
  accounts = accounts.concat(
    transaction?.meta?.loadedAddresses?.writable ?? []
  );

  let tokenBalanceChanges = parseTokenChanges(
    transaction?.meta?.preTokenBalances,
    transaction?.meta?.postTokenBalances
  );
  let solChanges = parseSolChanges(
    accounts,
    transaction?.meta?.preBalances ?? [],
    transaction?.meta?.postBalances ?? []
  );

  // Keep track of order of instructions (may not be able get stack depth for each inner ix because of log truncation)
  let traceIdx = 0;
  let parsedTrace = parseLogs(transaction?.meta?.logMessages ?? []);

  // Loop through top-level instructions
  let outerIdx = 0;
  let innerIdx = 0;
  for (const outerIx of transaction?.transaction.message.compiledInstructions ??
    []) {
    const programId = accounts[outerIx.programIdIndex].toBase58();
    instructions.push(
      await parseAnchorIx({
        programId: programId,
        ixData: anchor.utils.bytes.base64.encode(Buffer.from(outerIx.data)),
        keys: outerIx.accountKeyIndexes.map((idx) => accounts[idx].toBase58()),
        depth: 0,
      })
    );
    traceIdx += 1;

    // Loop through inner instructions
    let innerIxBucket = transaction?.meta?.innerInstructions?.[innerIdx];
    if (innerIxBucket && innerIxBucket.index === outerIdx) {
      for (const innerIx of innerIxBucket.instructions) {
        if (
          parsedTrace[traceIdx].programId !==
          accounts[innerIx.programIdIndex].toBase58()
        ) {
          throw new Error("fuck");
        }
        instructions.push(
          await parseAnchorIx({
            programId: accounts[innerIx.programIdIndex].toBase58(),
            ixData: anchor.utils.bytes.base64.encode(
              anchor.utils.bytes.bs58.decode(innerIx.data)
            ),
            keys: innerIx.accounts.map((idx) => accounts[idx].toBase58()),
            depth: parsedTrace[traceIdx].depth ?? 1,
          })
        );
        traceIdx += 1;
      }
      innerIdx += 1;
    }

    outerIdx += 1;
  }
  const feePayer =
    transaction?.transaction.message.staticAccountKeys[0].toBase58();

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
