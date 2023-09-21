import { NextApiRequest, NextApiResponse } from "next";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, BorshAccountsCoder, BN } from "@coral-xyz/anchor";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

import configConstants, { CONNECTION } from "../../constants";
import { makeApiPostRequest } from "@/lib/middleware";
configConstants();

/**
 * Replace Anchor data (BNs, PublicKeys) with stringified data
 * @param obj
 * @returns
 */
export function stringifyAnchorObject(obj: any): any {
  if (obj === true || obj === false) {
    return obj;
  } else if (!obj) {
    return {};
  } else if (obj instanceof BN) {
    return obj.toString();
  } else if (obj instanceof PublicKey) {
    return obj.toString();
  } else if (typeof obj === "bigint") {
    let bigInt = obj as BigInt;
    return bigInt.toString();
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
      acc[key] = stringifyAnchorObject(obj[key]);
      return acc;
    }, {});
  }

  return obj;
}

/**
 * Returns accountInfo or extends it with deserialized account data if the account is a program account of an Anchor program
 * @param accountAddress
 * @returns
 */
async function getParsedAccountInfo(connection: Connection, accountAddress: PublicKey) {
  // TODO: copy the explorer code here that manually deserializes a bunch of stuff, like Mango & Pyth

  const accountInfo = (await connection.getAccountInfo(accountAddress)) as any;
  // If acccount is not a program, check for Anchor IDL
  if (accountInfo?.owner && !accountInfo.executable) {
    try {
      const program = await Program.at(
        accountInfo.owner,
        new AnchorProvider(connection, new NodeWallet(Keypair.generate()), {
          commitment: "confirmed",
        }),
      );

      // Search through Anchor IDL for the account type
      const rawData = accountInfo.data;
      const coder = new BorshAccountsCoder(program.idl);
      const accountDefTmp = program.idl.accounts?.find((accountType: any) =>
        (rawData as Buffer)
          .slice(0, 8)
          .equals(BorshAccountsCoder.accountDiscriminator(accountType.name)),
      );

      // If we found the Anchor IDL type, decode the account state
      if (accountDefTmp) {
        const accountDef = accountDefTmp;

        // Decode the anchor data & stringify the data
        const decodedAccountData = stringifyAnchorObject(coder.decode(accountDef.name, rawData));

        let payload = {
          ...accountInfo,
          extended: decodedAccountData,
        };
        delete payload["data"];
        return payload;
      }
    } catch (err) {
      console.log(err);
    }
  }
  return accountInfo || {};
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const accountInfo = await getParsedAccountInfo(CONNECTION, req.body["address"]);
  res.status(200).json(accountInfo);
}

export default makeApiPostRequest(handler, { addresses: ["address"] });
