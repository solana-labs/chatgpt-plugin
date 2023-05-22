import { NextApiRequest } from "next";

import { base64 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import { HYPERSPACE_CLIENT } from "../../../constants";
import { makeRespondToSolanaPayPost, makeRespondToSolanaPayGet } from ".";

async function hyperspaceCreateListTx(
  seller: string,
  token: string,
  price: number
) {
  let transactionData = await HYPERSPACE_CLIENT.createListTx({
    sellerAddress: seller,
    tokenAddress: token,
    price: price,
    // Take no fee on making tx for ChatGPT users
    sellerBroker: "",
    sellerBrokerBasisPoints: 0,
  });
  const txBytes = base64.encode(
    Buffer.from(transactionData.createListTx.stdBuffer!)
  );

  return {
    transaction: txBytes,
  };
}

export async function createListNFT(req: NextApiRequest) {
  const { token, price } = req.query;
  const { account: seller } = req.body;
  return await hyperspaceCreateListTx(
    seller as string,
    token as string,
    Number.parseFloat(price as string)
  );
}

export default makeRespondToSolanaPayGet(
  makeRespondToSolanaPayPost(createListNFT)
);
