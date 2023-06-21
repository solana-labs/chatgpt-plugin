import { TokenBalancesByOwnerRequest, TokenPriceBatchedRequest } from "@hellomoon/api";
import { NextApiRequest, NextApiResponse } from "next";

import configConstants, { CONNECTION, HELLOMOON_CLIENT } from "../../constants";
import { PublicKey } from "@solana/web3.js";
configConstants();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let tokenInfos = await HELLOMOON_CLIENT.send(
    new TokenBalancesByOwnerRequest({
      ownerAccount: req.body.address,
    }),
  );

  let mints: string[] = [];
  let mintAmount: Record<string, number> = {};
  for (const info of tokenInfos) {
    if (info.amount !== "0") {
      mints.push(info.mint);
      mintAmount[info.mint] = Number.parseInt(info.amount);
    }
  }

  let mintPrice: Record<string, number> = {};
  let mintVolume: Record<string, number> = {};

  let pricePromises: Promise<any>[] = [];
  let decimalPromises: Promise<any>[] = [];
  let counter = 0;
  let batchSize = 10;
  while (counter < mints.length) {
    pricePromises.push(
      HELLOMOON_CLIENT.send(
        new TokenPriceBatchedRequest({ mints: mints.slice(counter, counter + batchSize) }),
      ),
    );
    for (let i = counter; i < Math.min(counter + batchSize, mints.length); i++) {
      decimalPromises.push(CONNECTION.getParsedAccountInfo(new PublicKey(mints[i])));
    }
    counter += batchSize;
  }
  let allData = await Promise.all([...decimalPromises, ...pricePromises]);
  let decimalData = allData.slice(0, mints.length);
  let mintDecimals: Record<string, number> = {};
  decimalData.forEach((accountInfo, index) => {
    mintDecimals[mints[index]] = accountInfo!.value!.data?.parsed?.info?.decimals;
  });

  let priceData = allData.slice(mints.length);

  let total = 0;
  for (const mintPriceData of priceData) {
    for (const price of (mintPriceData as any).data) {
      if (price.price) {
        let decimal = mintDecimals[price.mints];
        console.log({ mint: price.mints, decimal });
        mintPrice[price.mints] = price.price / 1e6;
        mintVolume[price.mints] = price.volume;
        total += (mintPrice[price.mints] * mintAmount[price.mints]) / Math.pow(10, decimal);
      }
    }
  }
  mintPrice["total"] = total;

  res.status(200).json({ total });
}
