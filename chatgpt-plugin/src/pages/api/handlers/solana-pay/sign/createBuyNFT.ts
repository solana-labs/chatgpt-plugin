import { NextApiRequest } from "next";

import { base64 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import configConstants, { HYPERSPACE_CLIENT } from "../../../constants";
configConstants();

import { makeRespondToSolanaPayPost, makeRespondToSolanaPayGet } from ".";

async function hyperspaceCreateBuyTx(
  buyer: string,
  token: string,
  price: number
) {
  let transactionData = await HYPERSPACE_CLIENT.createBuyTx({
    buyerAddress: buyer,
    tokenAddress: token,
    price: price,
    // Take no fee on making tx for ChatGPT users
    buyerBroker: "",
    buyerBrokerBasisPoints: 0,
  });
  const txBytes = base64.encode(
    Buffer.from(transactionData.createBuyTx.stdBuffer!)
  );

  return {
    transaction: txBytes,
  };
}

export async function createBuyNFT(req: NextApiRequest) {
  const { token, price } = req.query;
  const { account: buyer } = req.body;
  return await hyperspaceCreateBuyTx(
    buyer as string,
    token as string,
    Number.parseFloat(price as string)
  );
}

export default makeRespondToSolanaPayGet(
  makeRespondToSolanaPayPost(createBuyNFT)
);
