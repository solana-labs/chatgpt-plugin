// Deprecated - Not in use
import {
  Metaplex,
  toMetaplexFile,
  UploadMetadataInput,
} from "@metaplex-foundation/js";

import * as fs from "fs";

const ASSETS_DIR = "../chatgpt-plugin/public/assets/";
export async function uploadMetadata(metaplex: Metaplex, nonce: number) {
  const EXTENSION = "png";
  const buffer = fs.readFileSync(`${ASSETS_DIR}${nonce}.${EXTENSION}`);
  const file = toMetaplexFile(buffer, `${nonce}.${EXTENSION}`);
  const imageUri = await metaplex.storage().upload(file);
  console.log(`${ASSETS_DIR}${nonce}.json`);
  const data = fs.readFileSync(`${ASSETS_DIR}${nonce}.json`, "utf-8");
  const nftInfo = JSON.parse(data);

  const nftMetadata: UploadMetadataInput = {
    name: `${nftInfo.name ?? "NFT"}`,
    symbol: `${nftInfo.symbol ?? "NFT"}`,
    description: `${nftInfo.description ?? "NFT"}`,
    image: imageUri,
    properties: {
      files: [
        {
          uri: `${nonce}.${EXTENSION}`,
          type: `image/${EXTENSION}`,
        },
      ],
    },
  };
  const { uri } = await metaplex.nfts().uploadMetadata(nftMetadata);
  console.log("metadata URI", uri);
}
