/**
 * Deprecated until Compressed NFT creation is supported
 */
import { NextApiRequest } from "next";
import { CONNECTION } from "../../../constants";
import { createWriteNFTMetadataTx } from "../../../../../lib/on-chain-metadata";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";

async function createWriteNFTMetadata(req: NextApiRequest) {
  const { image } = req.query;
  const { account: owner } = req.body;
  return await createWriteNFTMetadataTx(CONNECTION, owner as string, {
    image,
  });
}

export default makeRespondToSolanaPayGet(makeRespondToSolanaPayPost(createWriteNFTMetadata));
