/**
 * Deprecated until Compressed NFT creation is supported
 */
import { NextApiRequest } from "next";

import { createCloseNFTMetadataTx } from "../../../../../lib/on-chain-metadata";
import { CONNECTION } from "../../../constants";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";

async function createCloseNFTMetadata(req: NextApiRequest) {
  const { account } = req.query;
  const { account: owner } = req.body;
  return await createCloseNFTMetadataTx(CONNECTION, owner as string, account as string);
}

export default makeRespondToSolanaPayGet(makeRespondToSolanaPayPost(createCloseNFTMetadata));
