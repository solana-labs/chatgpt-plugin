# Solana ChatGPT Plugin
A ChatGPT plugin for Solana. Install as an unverified plugin with url `https://solana-gpt-plugin.onrender.com`.

## Endpoints

ChatGPT can POST to the following resources with the same request payload, e.g.
```json
{
  "address": "8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625"
}
```

### /getAccountInfo

Returns the output of `getAccountInfo` method from the RPC with buffer data, and if it can be deserialized by its program IDL, then the response payload has additional field called `extended` that has a JSON serialized string of the anchor data. Chat GPT's plugin model seems to be able to read this pretty well.
```json
{
  ...,
  "extended": "{\"authority\":\"8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625\",\"numMinted\":50}"
}
```

### /getBalance

Returns
```json
{
  "lamports": 42690
}
```


### /getAssetsByOwner

Returns the assets returned by the [Metaplex Read API spec](https://github.com/metaplex-foundation/api-specifications/blob/main/specifications/read_api/openrpc_spec.json)

### /getTransaction

Accepts
```json
{
  "signature": "h51pjmFcn8LkxejofUQoDYkyubUKaB7bNtyMMSCCamSEYRutS2G2vm2w1ERShko8boRqdaaTAs4MR6sGYkTByNF"
}
```

Returns the transaction status metadata for the `getTransaction` method from the Solana RPC.

### Endpoints for NFT discovery 
These endpoints are under development and subject to rapid change

#### /getCollectionsByFloorPrice

Returns
```json
{
  "projects": [
    {
      "id": "<hyperspace-collection-id or pubkey>",
      "desc": "collection description",
      "img": "collection image url",
      "website": "collection website url",
      "floor_price": 0.1
    }
  ],
  "hasMore": true,
  "currentPage'": 1
}
```

#### /getListedCollectionNFTs

Returns LLM friendly response of available NFTs:
```json
{ 
  "listings": [
    {
      "price": 0.1,
      "token": "<token-address-pubkey>",
      "marketplace": "<marketplace-pubkey>"
    }
  ],
  "hasMore": true,
  "currentPage": 1
} 
```

#### /createBuyTransaction

Right now we are trusting Hyperspace to craft a valid transaction for us. 
In the future we will setup a write interface for programs on Solana to adhere to in order to 
be a target of LLM transaction composition.

Returns
```json
{
  "linkToSign": "<url-to-sign-transaction>" 
}
```

### Endpoints for Transaction Composition (not LLM accessible)

These are also subject to change, and we may create actual webpages to inspect
the transaction before signing. However for now, these are simply redirect links 
to ensure that SolanaPay QR codes show up in the ChatGPT link previews.

#### /page/createBuyNFT

Returns a webpage with [OpenGraph](https://ogp.me/) metadata that will be rendered in the ChatGPT 
rich link preview. All ChatGPT links should be proxied through this sort of pipeline to maximize
user engagement of links. The `og:image` tag is to `/qr/createBuyNFT` to show a SolanaPay QR code in link previews.

This is currently a blank page, but we may show a preview of the transaction in the future.

#### /qr/createBuyNFT

Returns a PNG QR code that has been optimized to show in the particular aspect ratio of ChatGPT plugins. 
This just encodes a SolanaPay link that redirects to `/sign/createBuyNFT`. 

#### /sign/createBuyNFT

This is the final redirect link that actually returns transaction bytes in a SolanaPay compatible format
so users can sign transactions that are recommended by ChatGPT.

```json
{
  "transaction": "<base64-encoded-transaction-bytes>"
}
```

## Development

To install dependencies, just execute `yarn`. This project uses `node` with version `>=16.17.0`.

To start a development server, execute `yarn dev`. This will start the plugin available from `localhost:3333` with its own configuration settings in `.well-known-dev/`.
