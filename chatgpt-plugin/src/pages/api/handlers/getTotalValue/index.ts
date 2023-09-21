import { TokenPriceBatchedRequest, NftMintPriceByCreatorAvgRequest } from "@hellomoon/api";
import { PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

import { readApiGetAssetsByOwner } from "../getAssetsByOwner";
import configConstants, { CONNECTION, HELLOMOON_CLIENT } from "../../constants";
import { makeApiPostRequest } from "@/lib/middleware";
configConstants();

async function getTokenTotal(address: string) {
  let connection = CONNECTION;
  let tokenInfos = await (
    await fetch(
      `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${process.env.HELIUS_API_KEY}`,
    )
  ).json();

  let mints: string[] = [];
  let mintAmount: Record<string, number> = {};
  for (const info of tokenInfos["tokens"] as any) {
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
      decimalPromises.push(connection.getParsedAccountInfo(new PublicKey(mints[i])));
    }
    counter += batchSize;
  }
  let allData: any[] = [];
  try {
    allData = await Promise.all([...decimalPromises, ...pricePromises]);
  } catch (e) {
    console.error("Failed to getParsedAccountInfo:", e);
    throw e;
  }
  let decimalData = allData.slice(0, mints.length);
  let mintDecimals: Record<string, number> = {};
  decimalData.forEach((accountInfo, index) => {
    mintDecimals[mints[index]] = accountInfo!.value!.data?.parsed?.info?.decimals;
  });

  let priceData = allData.slice(mints.length);

  let tokenTotal = 0;
  for (const mintPriceData of priceData) {
    for (const price of (mintPriceData as any).data) {
      if (price.price) {
        let decimal = mintDecimals[price.mints];
        mintPrice[price.mints] = price.price / 1e6;
        mintVolume[price.mints] = price.volume;
        tokenTotal += (mintPrice[price.mints] * mintAmount[price.mints]) / Math.pow(10, decimal);
      }
    }
  }
  return (Number(tokenTotal * 100).toFixed(1) as any as number) / 100;
}

async function getNFTTotal(address: string) {
  let assets = ((await readApiGetAssetsByOwner(address, 1, 100)) as any).items;
  assets = assets.filter((asset: any) => asset.grouping.length > 0);

  let groupings: Record<string, number> = {};
  for (const asset of assets) {
    if (asset.grouping.length === 0) {
      continue;
    }
    let grouping = asset.grouping[0];
    let collection = grouping.group_value;
    groupings[collection] = (groupings[collection] || 0) + 1;
  }

  let assetIds = assets.map((asset: any) => asset.id);
  let nftPricePromises = assetIds.map((id: string) => {
    return HELLOMOON_CLIENT.send(
      new NftMintPriceByCreatorAvgRequest({
        nftMint: id,
      }),
    ).then(price => price.data[0]?.avg_usd_price ?? 0);
  });
  let prices = await Promise.all(nftPricePromises);

  let nftTotal: number = prices.reduce((a, b) => a + b, 0);
  return (Number(nftTotal * 100).toFixed(1) as any as number) / 100;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.body["address"];

  let totals = await Promise.all([
    getTokenTotal(address.toString()),
    getNFTTotal(address.toString()),
  ]);
  let [tokenTotal, nftTotal] = totals;
  res.status(200).json({ tokenTotal, nftTotal, total: tokenTotal + nftTotal });
}

export default makeApiPostRequest(handler, { addresses: ["address"] });
