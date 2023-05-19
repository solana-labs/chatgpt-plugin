import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import path from "path";
import fs from "fs";
// import AIPlugin from "public/ai-plugin.json";
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
  if (file == "logo.png") {
    res.status(200).send(Logo);
  } else if (file == "openapi.yaml") {
    // Construct path to yaml file
    const filePath = path.join(process.cwd(), "public", "openapi.yaml");

    // Read yaml file synchronously
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Return data
    res.status(200).send(fileContents);
  } else {
    res.status(404).send({ message: "Not found" });
  }
}
