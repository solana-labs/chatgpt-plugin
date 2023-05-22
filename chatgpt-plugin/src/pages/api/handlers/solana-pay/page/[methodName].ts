/// DEPRECATED - NO LONGER IN USE
import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "querystring";

import configConstants, { SELF_URL, TX_DESCRIPTIONS } from "../../../constants";
configConstants();

function createOpenGraphMetaPage(
  methodName: string,
  encoded: string,
  description: string
): string {
  let qrCodeUri = new URL(
    `${SELF_URL}/api/handlers/solana-pay/qr/${methodName}?${encoded}`
  );
  return `<html>
    <meta property="og:title" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SELF_URL}/page/${methodName}?${encoded}" />
    <meta property="og:image" content="${qrCodeUri}" />
    </html>`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { methodName },
  } = req;
  console.log("OpenGraph metapage requested:", methodName, req.query);

  let description = TX_DESCRIPTIONS[methodName as string];
  res
    .status(200)
    .send(
      createOpenGraphMetaPage(
        methodName as string,
        encode(Object(req.query)),
        description
      )
    );
}
