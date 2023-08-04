# Solana ChatGPT Plugin
A ChatGPT plugin for Solana. Install as an unverified plugin with url `https://chatgpt.solanalabs.com`.

<div>
<img width="350" alt="Search NFTs in ChatGPT" src="https://user-images.githubusercontent.com/7481857/231182274-40b42f0e-5e5d-4050-9e31-2f75375481c1.png">
</div>

## Endpoints

ChatGPT can POST to the following resources, as described by `.well-known/openapi.yaml`.


<details>
<summary>
/getAccountInfo { address }
</summary>

Returns the output of `getAccountInfo` method from the RPC with buffer data, and if it can be deserialized by its program IDL, then the response payload has additional field called `extended` that has a JSON serialized string of the anchor data. Chat GPT's plugin model seems to be able to read this pretty well.

```json
{
  ...,
  "extended": "{\"authority\":\"8fbqVvpK3Dj7fdP2c8JJhtD7Zy3n9qtwAeGfbkgPu625\",\"numMinted\":50}"
}
```
</details>

<details>
<summary>/getBalance { address }</summary>

Returns
```json
{
  "sol": 0.40296
}
```
</details>

<details>
<summary>/getAssetsByOwner { address }</summary>

Returns the assets returned by the [Metaplex Read API spec](https://github.com/metaplex-foundation/api-specifications/blob/main/specifications/read_api/openrpc_spec.json)
</details>

<details>
<summary>/getTransaction { signature } </summary>

Accepts
```json
{
  "signature": "h51pjmFcn8LkxejofUQoDYkyubUKaB7bNtyMMSCCamSEYRutS2G2vm2w1ERShko8boRqdaaTAs4MR6sGYkTByNF"
}
```

Returns human-readable transaction information, parsed from the `getTransaction` method of the Solana RPC.
</details>

<details>
<summary>/getTokenAccounts { address }</summary>

Returns the token accounts owned by a user with an amount > 0. Derived from the `getTokenAccountsByOwner` method on the Solana RPC.

</details>

<details>
<summary>/getSignaturesForAddress { address } </summary>

Returns the transaction signatures returned in `getSignaturesForAddress` method from the Solana RPC.

</details>


<details>
<summary>
/getTotalValue { address }
</summary>

Returns the total value of the assets owned by `address`, broken down by NFTs and tokens. Token prices and NFT price estimates are provided by HelloMoon. An example output is provided below

```json
{
  "total": "50.00",
  "nftTotal": "25.00",
  "tokenTotal": "25.00"
}
```
</details>

### Endpoints for NFT discovery 
These endpoints are under development and subject to rapid change. These currently use the [Hyperspace API](https://docs.hyperspace.xyz).

<details>
<summary>/getCollectionsByFloorPrice { maxFloorPrice, minFloorPrice, orderBy, pageSize } </summary>

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
</details>

<details>
<summary>/getListedCollectionNFTs { projectId, pageSize, priceOrder }</summary>

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
</details>


## Private endpoints (not LLM accessible)

### Endpoints for Sending Transactions

Note: these endpoints are currently disabled in the production version of the ChatGPT plugin

<details>
<summary> /createBuyTransaction { token, price }</summary>

Right now we are trusting Hyperspace to craft a valid transaction for us. 
In the future we will setup a write interface for programs on Solana to adhere to in order to 
be a target of LLM transaction composition.

Returns
```json
{
  "linkToSign": "<url-to-sign-transaction>" 
}
```
</details>

<details>
<summary> /createTransferSol { destination, amount }</summary>

Creates a transaction to transfer an amount in Sol.

Returns
```json
{
  "linkToSign": "<url-to-sign-transaction>" 
}
```
</details>

<details>
<summary> /createTransferToken { destination, mint, amount }</summary>

Creates a transaction to transfer an amount of token (from the mint).

Returns
```json
{
  "linkToSign": "<url-to-sign-transaction>" 
}
```
</details>

### Endpoints for Transaction Composition

These are also subject to change, and we may create actual webpages to inspect
the transaction before signing. However for now, these are simply redirect links 
to ensure that SolanaPay QR codes show up in the ChatGPT link previews.

<details>
<summary>/page/:methodName</summary>

Returns a webpage with [OpenGraph](https://ogp.me/) metadata that will be rendered in the ChatGPT 
rich link preview. All ChatGPT links should be proxied through this sort of pipeline to maximize
user engagement of links. The `og:image` tag is to `/qr/:methodName` to show a SolanaPay QR code in link previews.

This is currently a blank page, but we may show a preview of the transaction in the future.
</details>

<details>
<summary>/qr/:methodName</summary>

Returns a PNG QR code that has been optimized to show in the particular aspect ratio of ChatGPT plugins. 
This just encodes a SolanaPay link that redirects to `/sign/:methodName`. 
</details>

<details>
<summary>/sign/:methodName</summary>

This is the final redirect link that actually returns transaction bytes in a SolanaPay compatible format
so users can sign transactions that are recommended by ChatGPT.

```json
{
  "transaction": "<base64-encoded-transaction-bytes>"
}
```
</details>

## Development

To install dependencies, just execute `yarn`. This project uses `node` with version `>=16.17.0`.

To start a development server, execute `yarn dev`. This will start the plugin available from `localhost:3333` with its own configuration settings in `.well-known-dev/`.

# License

This codebase is released under [Apache License 2.0](LICENSE.md).

# Disclaimer

By accessing or using this codebase or any of its components, you accept and agree with the [Disclaimer](DISCLAIMER.md).
