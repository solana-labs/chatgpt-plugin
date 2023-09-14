import {
  ALL_DEPTH_SIZE_PAIRS,
  DepthSizePair,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { CONNECTION } from "../../constants";
configConstants();

function isValidDepthSizePair(maxDepth: number, maxBufferSize: number): boolean {
  const pair: DepthSizePair = {
    maxDepth,
    maxBufferSize,
  };
  return ALL_DEPTH_SIZE_PAIRS.some(validPair => isEqualDepthSizePair(validPair, pair));
}

function isEqualDepthSizePair(pair1: DepthSizePair, pair2: DepthSizePair): boolean {
  return pair1.maxDepth === pair2.maxDepth && pair1.maxBufferSize === pair2.maxBufferSize;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { treeSize, canopySize, customMaxDepth, customMaxBufferSize, customCanopyDepth } = req.body;
  let maxDepth: number, maxBufferSize: number, canopyDepth: number;
  if (treeSize.toLowerCase() == "custom") {
    if (customMaxDepth == undefined || customMaxBufferSize == undefined) {
      res.status(400).send({ message: "Missing tree size custom parameters" });
      return;
    }
    maxDepth = customMaxDepth;
    maxBufferSize = customMaxBufferSize;
  } else if (treeSize.toLowerCase() == "small") {
    maxDepth = 14;
    maxBufferSize = 64;
  } else if (treeSize.toLowerCase() == "medium") {
    maxDepth = 20;
    maxBufferSize = 64;
  } else if (treeSize.toLowerCase() == "large") {
    maxDepth = 30;
    maxBufferSize = 512;
  } else {
    res.status(400).send({ message: "Invalid tree size enum" });
    return;
  }

  if (!isValidDepthSizePair(maxDepth, maxBufferSize)) {
    res.status(400).send({ message: "Invalid tree Depth and Buffer Size pair" });
    return;
  }

  if (canopySize.toLowerCase() == "custom") {
    if (customCanopyDepth == undefined) {
      res.status(400).send({ message: "Missing custom canopy depth parameter" });
      return;
    }
    canopyDepth = customCanopyDepth;
  } else if (canopySize.toLowerCase() == "small") {
    canopyDepth = 3;
  } else if (canopySize.toLowerCase() == "medium") {
    canopyDepth = 14;
  } else if (canopySize.toLowerCase() == "large") {
    canopyDepth = 17;
  } else if (canopySize.toLowerCase() == "none") {
    canopyDepth = 0;
  } else {
    res.status(400).send({ message: "Invalid canopy size enum" });
    return;
  }

  const requiredSpace = getConcurrentMerkleTreeAccountSize(maxDepth, maxBufferSize, canopyDepth);

  const rent = await CONNECTION.getMinimumBalanceForRentExemption(requiredSpace);
  res.status(200).send({
    rentInSol: rent / LAMPORTS_PER_SOL,
    maxNumberOfNFTs: 2 ** maxDepth,
  });
}
