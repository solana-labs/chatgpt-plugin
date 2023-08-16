import { NextApiRequest, NextApiResponse } from "next";
import configConstants from "../../constants";
configConstants();

const publicTreeAddresses: String[] = [
  "3cnMCu5hezx9h6kjEYdTb7PRKch4a6KRFBoUF8SJEsT8",
  "GNsnin9c2nDGp78E69tGXyMScWfysnu2PuxQxXy1jh3R",
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send({ publicTreeAddresses: publicTreeAddresses });
}
