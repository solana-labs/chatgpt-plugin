import { Request, Response } from "express";
import { encode } from "querystring";

import { encodeURL } from "@solana/pay";
import * as qrcode from "qrcode";
import sharp from "sharp";

import {
  SELF_URL,
  SOLANA_PAY_LABEL,
  TX_DESCRIPTIONS,
  TransactionEndpoints,
} from "../../../constants";

async function createQRCodePng(
  methodName: string,
  encoded: string
): Promise<Buffer> {
  let uri = new URL(`${SELF_URL}/sign/${methodName}?${encoded}`);
  let solanaPayUrl = encodeURL({
    link: uri,
    label: SOLANA_PAY_LABEL,
  });
  console.log("Solana pay url", solanaPayUrl.toString());

  let dataUrl = await qrcode.toDataURL(solanaPayUrl.toString());
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  return await sharp(imageBuffer)
    .extend({
      extendWith: "background",
      background: "#ffffff",
      left: 110,
      right: 110,
    })
    .toBuffer();
}

export function makeCreateQrCode(methodName: TransactionEndpoints) {
  return async (req: Request, res: Response) => {
    console.log("QR code requested:", methodName, req.query);

    let buffer = await createQRCodePng(methodName, encode(Object(req.query)));
    res.status(200).send(buffer);
  };
}
