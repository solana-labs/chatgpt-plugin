import { NextApiRequest, NextApiResponse } from "next";

// Setup Solflare
import { Client } from "@solflare-wallet/utl-sdk";
const utl = new Client();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { tokenName } = req.body;

  let results = await (
    await utl.searchMints(tokenName)
  )
    .filter((res: any) => {
      return res["verified"] && res["holders"] > 0 && res["chainId"] === 101;
    })
    .map((res: any) => {
      return {
        mintAddress: res["address"],
        tokenName: res["name"],
        tokenSymbol: res["symbol"],
        holders: res["holders"],
        verified: res["verified"],
        chainId: res["chainId"],
        logoURI: res["logoURI"],
      };
    });

  res.status(200).json(results.slice(0, 10));
}
