import { NextApiRequest, NextApiResponse } from "next";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import configConstants, { CONNECTION } from "../../constants";
import { makeApiPostRequest } from "@/lib/middleware";
configConstants();

type TokenInfo = {
  mint: string;
  amount: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let result = await CONNECTION.getParsedTokenAccountsByOwner(
    req.body["address"],
    { programId: TOKEN_PROGRAM_ID },
    "confirmed",
  );
  const tokenInfos: TokenInfo[] = [];
  for (const accountInfo of result.value) {
    const info = accountInfo.account.data.parsed.info;
    if (info.tokenAmount.uiAmount !== 0) {
      tokenInfos.push({
        mint: info.mint.toString(),
        amount: info.tokenAmount.uiAmountString,
      });
    }
  }
  res.status(200).json(tokenInfos);
}

export default makeApiPostRequest(handler, { addresses: ["address"] });
