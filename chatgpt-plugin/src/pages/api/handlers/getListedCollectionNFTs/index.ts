import { Request, Response } from "express";
import { HYPERSPACE_CLIENT } from "../../constants";

type NFTListing = {
  price: number;
  image: string;
  token: string;
};

type ListedNFTResponse = {
  listings: NFTListing[];
  hasMore: boolean;
};

async function hyperspaceGetListedCollectionNFTs(
  projectId: string,
  pageSize: number = 5,
  priceOrder: string = "DESC"
): Promise<ListedNFTResponse> {
  let listedNFTs: NFTListing[] = [];
  let hasMore = true;
  let pageNumber = 1;
  while (listedNFTs.length < pageSize && hasMore) {
    let results = await HYPERSPACE_CLIENT.getMarketplaceSnapshot({
      condition: {
        projects: [{ project_id: projectId }],
        onlyListings: true,
      },
      orderBy: {
        field_name: "lowest_listing_price",
        sort_order: priceOrder as any,
      },
      paginationInfo: {
        page_number: pageNumber,
      },
    });

    let snaps = results.getMarketPlaceSnapshots.market_place_snapshots!;
    let orderedListings = snaps.sort(
      (a, b) => a.lowest_listing_mpa!.price! - b.lowest_listing_mpa!.price!
    );

    pageNumber += 1;
    let crucialInfo: NFTListing[] = orderedListings
      .filter(
        (arr) =>
          // We filter out Magic Eden's marketplace because they
          // require an API key to make purchases programmatically
          arr.lowest_listing_mpa?.marketplace_program_id !==
          "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"
      )
      .map((arr) => {
        return {
          price: arr.lowest_listing_mpa!.price!,
          token: arr.token_address,
          image: arr.meta_data_img ?? "",
          marketplace: arr.lowest_listing_mpa!.marketplace_program_id!,
        };
      });
    listedNFTs = listedNFTs.concat(crucialInfo);
    hasMore = results.getMarketPlaceSnapshots.pagination_info.has_next_page;
  }

  return {
    listings: listedNFTs.slice(0, pageSize),
    hasMore,
  };
}

export async function getListedCollectionNFTs(req: Request, res: Response) {
  const { projectId, pageSize, priceOrder } = req.body;
  const result = await hyperspaceGetListedCollectionNFTs(
    projectId,
    pageSize,
    priceOrder
  );
  res.status(200).send(JSON.stringify(result));
}
