import { Request } from "express";

import { createCloseNFTMetadataTx } from "../../../on-chain-metadata";
import { CONNECTION } from "../../../constants";

export async function createCloseNFTMetadata(req: Request) {
  const { account } = req.query;
  const { account: owner } = req.body;
  return await createCloseNFTMetadataTx(
    CONNECTION,
    owner as string,
    account as string
  );
}
