import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import path from "path";
import fs from "fs";
import AIPlugin from "public/ai-plugin.json";
import Logo from "public/logo.png";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const {
    query: { file },
  } = req;
  let response = await fetch(`/api/well-known/${file}`);

  res.status(200).send(await response.arrayBuffer);
}
