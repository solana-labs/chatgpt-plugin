import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { SOLANA_PAY_LABEL } from "../../../constants";
import { Options, makeApiPostRequest } from "@/lib/middleware";
export type TransactionHandler = (req: NextApiRequest) => Promise<{ transaction: string }>;

export function makeRespondToSolanaPayGet(apiHandler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
      res.status(200).json({
        label: SOLANA_PAY_LABEL,
        icon: "https://solanapay.com/src/img/branding/Solanapay.com/downloads/gradient.svg",
      });
    } else {
      await apiHandler(req, res);
    }
  };
}

export function makeRespondToSolanaPayPost(handler: TransactionHandler, options?: Options) {
  return makeApiPostRequest(
    async (req: NextApiRequest, res: NextApiResponse) => {
      let result = await handler(req);
      res.status(200).json(result);
    },
    { ...options, rewriteQuery: true },
  );
}
