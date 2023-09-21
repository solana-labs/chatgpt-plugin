import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@solflare-wallet/utl-sdk";
import { makeApiPostRequest } from "@/lib/middleware";
const utl = new Client();

async function handler(req: NextApiRequest, res: NextApiResponse) {
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
export default makeApiPostRequest(handler);
