import { Request } from "express";
export type TransactionHandler = (
  req: Request
) => Promise<{ transaction: string }>;
