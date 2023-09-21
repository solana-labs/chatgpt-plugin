import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HELIUS_URL } from "../../constants";
configConstants();

import axios from "axios";
import { makeApiPostRequest } from "@/lib/middleware";

/**
 * Returns the data from the Metaplex Read API
 * @param address
 * @param page (optional) page number
 * @param limit (optional) set to 5 to prevent overflowing GPT context window
 * @returns
 */
export const readApiGetAssetsByOwner = async (
  address: string,
  page: number = 1,
  limit: number = 5,
) => {
  const sortBy = {
    sortBy: "created",
    sortDirection: "asc",
  };
  const before = "";
  const after = "";
  const { data } = await axios.post(HELIUS_URL, {
    jsonrpc: "2.0",
    id: "my-id",
    method: "getAssetsByOwner",
    params: [address, sortBy, limit, page, before, after],
  });
  return data.result;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const assets = await readApiGetAssetsByOwner(req.body["address"].toString());
  res.status(200).send(assets);
}

export default makeApiPostRequest(handler, { addresses: ["address"] });
