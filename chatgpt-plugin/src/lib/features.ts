/**
 *
 */

export type Endpoint = {
  label: string;
  description: string;
};

export const features: Array<Endpoint> = [
  {
    label: "/getAccountInfo { address }",
    description:
      "Returns the output of `getAccountInfo` method from the RPC with buffer data, and if it can be deserialized by its program IDL, then the response payload has additional field called `extended` that has a JSON serialized string of the anchor data. ChatGPT's plugin model seems to be able to read this pretty well.",
  },
  {
    label: "/getBalance { address }",
    description: "Returns the balance of the `address`, in units of lamports.",
  },
];
