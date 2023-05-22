import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "querystring";

import { encodeURL } from "@solana/pay";
import * as qrcode from "qrcode";
import sharp from "sharp";

import configConstants, {
  SELF_URL,
  SOLANA_PAY_LABEL,
} from "../../../constants";
configConstants();

async function createQRCodePng(
  methodName: string,
  encoded: string
): Promise<Buffer> {
  let uri = new URL(
    `${SELF_URL}/api/handlers/solana-pay/sign/${methodName}?${encoded}`
  );
  let solanaPayUrl = encodeURL({
    link: uri,
    label: SOLANA_PAY_LABEL,
  });

  let dataUrl = await qrcode.toDataURL(solanaPayUrl.toString());
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  return await sharp(imageBuffer)
    .extend({
      extendWith: "background",
      background: "#ffffff",
      left: 10,
      right: 10,
    })
    .toBuffer();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { methodName },
  } = req;

  console.log("QR code requested:", methodName, req.query);

  let buffer = await createQRCodePng(
    methodName as string,
    encode(Object(req.query))
  );
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Disposition", "inline");
  res.status(200).send(buffer);
}
