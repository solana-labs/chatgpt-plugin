import { Request, Response } from "express";
import { encode } from "querystring";

import {
  SELF_URL,
  TX_DESCRIPTIONS,
  TransactionEndpoints,
} from "../../../constants";

function createOpenGraphMetaPage(
  methodName: string,
  encoded: string,
  description: string
): string {
  let qrCodeUri = new URL(`${SELF_URL}/qr/${methodName}?${encoded}`);
  return `<html>
    <meta property="og:title" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SELF_URL}/page/${methodName}?${encoded}" />
    <meta property="og:image" content="${qrCodeUri}" />
    </html>`;
}

export function makeQrcodeLinkPreview(methodName: TransactionEndpoints) {
  return async (req: Request, res: Response) => {
    console.log("OpenGraph metapage requested:", methodName, req.query);

    let description = TX_DESCRIPTIONS[methodName];
    res
      .status(200)
      .send(
        createOpenGraphMetaPage(
          methodName,
          encode(Object(req.query)),
          description
        )
      );
  };
}
