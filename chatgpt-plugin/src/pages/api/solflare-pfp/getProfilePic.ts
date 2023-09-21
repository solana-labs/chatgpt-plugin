// Deprecated - Not in use
import { NextApiRequest, NextApiResponse } from "next";
import { getProfilePicture } from "@solflare-wallet/pfp";
import configConstants, { CONNECTION } from "../constants";
configConstants();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  let publicKey = req.body.publicKey;
  let pfpResult = await getProfilePicture(CONNECTION, publicKey);
  res.status(200).send(pfpResult);
}
