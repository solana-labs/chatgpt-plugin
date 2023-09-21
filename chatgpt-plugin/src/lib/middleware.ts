import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { resolveAddress, resolveToken } from "./address";

export type Options = {
  addresses?: string[];
  tokens?: string[];
  rewriteQuery?: boolean;
};

export function makeApiPostRequest(handler: NextApiHandler, options?: Options): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const rewriteQuery = options ? options.rewriteQuery : false;

    if (req.method != "POST") {
      res.status(405).send({ message: "Only POST requests allowed" });
      return;
    }

    const target = rewriteQuery ? req.query : req.body;
    try {
      if (options && options.addresses) {
        for (const addr of options.addresses) {
          const publicKey = await resolveAddress(target[addr]);
          target[addr] = publicKey;
        }
      }
      if (options && options.tokens) {
        for (const token of options.tokens) {
          const publicKey = await resolveToken(target[token]);
          target[token] = publicKey;
        }
      }
    } catch (e) {
      res.status(400).send({ message: (e as Error).toString() });
      return;
    }

    await handler(req, res);
  };
}
