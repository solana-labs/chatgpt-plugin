import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CONNECTION } from "../../constants";

type TokenInfo = {
  mint: string;
  amount: string;
};

export async function getTokenAccounts(req: Request, res: Response) {
  let result = await CONNECTION.getParsedTokenAccountsByOwner(
    new PublicKey(req.body.address),
    { programId: TOKEN_PROGRAM_ID },
    "confirmed"
  );
  const tokenInfos: Omit<TokenInfo, "usdValue">[] = [];
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
