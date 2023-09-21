import { NextApiRequest, NextApiResponse } from "next";
import { TipLink } from "@tiplink/api";
import { makeApiPostRequest } from "@/lib/middleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tp = await TipLink.create();
  res.status(200).send({ url: tp.url, tipLinkAddress: tp.keypair.publicKey.toBase58() });
}

export default makeApiPostRequest(handler);
