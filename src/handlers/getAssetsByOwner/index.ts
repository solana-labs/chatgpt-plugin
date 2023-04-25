import { Request, Response } from "express";
import { PublicKey } from "@solana/web3.js";
import { HELIUS_URL } from "../../constants";
import axios from "axios";

/**
 * Returns the data from the Metaplex Read API
 * @param address
 * @param page (optional) page number
 * @param limit (optional) set to 5 to prevent overflowing GPT context window
 * @returns
 */
const _getAssetsByOwner = async (
  address: string,
  page: number = 1,
  limit: number = 5
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

export async function getAssetsByOwner(req: Request, res: Response) {
  const accountAddress = new PublicKey(req.body.address);
  const assets = await _getAssetsByOwner(accountAddress.toString());
  res.status(200).send({ message: JSON.stringify(assets) });
}
