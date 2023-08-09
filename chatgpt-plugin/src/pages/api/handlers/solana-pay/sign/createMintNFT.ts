import { NextApiRequest } from "next";
import {
    PublicKey
  } from "@solana/web3.js";
import { makeRespondToSolanaPayGet, makeRespondToSolanaPayPost } from ".";
import { Metaplex } from "@metaplex-foundation/js";
import configConstants, { CONNECTION } from "../../../constants";
configConstants();

async function createMintNFT(req: NextApiRequest) { 
  const { name, metadataUri, sellerFee } = req.query;
  const { account: sender } = req.body;
  const metaplex = Metaplex.make(CONNECTION);
  const mintTransactionBuilder = await metaplex
  .nfts()
  .builders()
  .create({
    name: name as string,
    uri: metadataUri as string,
    sellerFeeBasisPoints: Number(sellerFee), // 2.5%
  });
  const latestBlockhashWithExpiryBlockHeight = await CONNECTION.getLatestBlockhash();
  const tx = mintTransactionBuilder.toTransaction(latestBlockhashWithExpiryBlockHeight)
  tx.feePayer = new PublicKey(sender);
  return {
      transaction: tx
        .serialize({ requireAllSignatures: false })
        .toString("base64"),
    };
}
export default makeRespondToSolanaPayGet(
  makeRespondToSolanaPayPost(createMintNFT)
);
