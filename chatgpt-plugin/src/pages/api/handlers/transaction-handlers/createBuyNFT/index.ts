import { Request } from "express";

import { base64 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import { HYPERSPACE_CLIENT } from "../../../constants";

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
  console.log("Transaction Data", transactionData);
  const txBytes = base64.encode(
    Buffer.from(transactionData.createBuyTx.stdBuffer!)
  );
  console.log("Transaction bytes:", txBytes);

  return {
    transaction: txBytes,
  };
}

export async function createBuyNFT(req: Request) {
  const { token, price } = req.query;
  const { account: buyer } = req.body;
  return await hyperspaceCreateBuyTx(
    buyer as string,
    token as string,
    Number.parseFloat(price as string)
  );
}
