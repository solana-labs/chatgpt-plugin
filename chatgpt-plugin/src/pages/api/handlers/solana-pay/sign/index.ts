import { NextApiRequest, NextApiResponse } from "next";
import { SOLANA_PAY_LABEL } from "../../../constants";
export type TransactionHandler = (
  req: NextApiRequest
) => Promise<{ transaction: string }>;

type NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

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

export function makeRespondToSolanaPayPost(handler: TransactionHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let result = await handler(req);
    res.status(200).json(result);
  };
}
