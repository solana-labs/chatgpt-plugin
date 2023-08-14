import { NextApiRequest, NextApiResponse } from "next";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import configConstants, { CONNECTION } from "../../constants";
import { getConcurrentMerkleTreeAccountSize, ALL_DEPTH_SIZE_PAIRS, DepthSizePair } from "@solana/spl-account-compression";
configConstants();

enum TreeSizes {
  Custom,
  Small, 
  Medium,
  Large
}
enum CanopySizes { 
  Custom,
  Small,
  Medium, 
  Large,
  None
}

function isValidDepthSizePair(maxDepth: number, maxBufferSize: number): boolean {
  const pair: DepthSizePair = {
    maxDepth,
    maxBufferSize,
  };
  return ALL_DEPTH_SIZE_PAIRS.some((validPair) =>
    isEqualDepthSizePair(validPair, pair)
  );
}

function isEqualDepthSizePair(pair1: DepthSizePair, pair2: DepthSizePair): boolean {
  return pair1.maxDepth === pair2.maxDepth && pair1.maxBufferSize === pair2.maxBufferSize;
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const { treeSize, canopySize, customMaxDepth, customMaxBufferSize, customCanopyDepth} = req.body;
  let maxDepth : number, maxBufferSize : number, canopyDepth : number;
  console.log("treeSize", treeSize == TreeSizes.Small);
  if (treeSize == TreeSizes.Custom) { 
    if (customMaxDepth == undefined || customMaxBufferSize == undefined) {
      res.status(400).send({ message: "Missing tree size custom parameters" });
      return;
    }
    maxDepth = customMaxDepth;
    maxBufferSize = customMaxBufferSize;
  } else if (treeSize == TreeSizes.Small) {
    maxDepth = 14;
    maxBufferSize = 64;
  } else if (treeSize == TreeSizes.Medium) {
    maxDepth = 20;
    maxBufferSize = 64;
  } else if (treeSize == TreeSizes.Large) {
    maxDepth = 30;
    maxBufferSize = 256;
  } else {
    res.status(400).send({ message: "Invalid tree size enum" });
    return;
  }

  if (!isValidDepthSizePair(maxDepth, maxBufferSize)) {
    res.status(400).send({ message: "Invalid tree Depth and Buffer Size pair" });
    return;
  }

  if (canopySize == CanopySizes.Custom) {
    if (customCanopyDepth == undefined) {
      res.status(400).send({ message: "Missing custom canopy depth parameter" });
      return;
    }
    canopyDepth = customCanopyDepth;
  } else if (canopySize == CanopySizes.Small) {
    canopyDepth = 3;
  } else if (canopySize == CanopySizes.Medium) {
    canopyDepth = 14;
  } else if (canopySize == CanopySizes.Large) {
    canopyDepth = 17;
  } else if (canopySize == CanopySizes.None) {
    canopyDepth = 0;
  } else {
    res.status(400).send({ message: "Invalid canopy size enum" });
    return;
  }

  const requiredSpace = getConcurrentMerkleTreeAccountSize(
    maxDepth,
    maxBufferSize,
    canopyDepth
  );

  const rent = await CONNECTION.getMinimumBalanceForRentExemption(requiredSpace);
  res.status(200).send({ sol: rent / LAMPORTS_PER_SOL, proofSize: maxDepth - canopyDepth, });
}