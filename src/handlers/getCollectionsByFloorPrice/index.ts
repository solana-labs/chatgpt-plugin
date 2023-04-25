import { Request, Response } from "express";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { HYPERSPACE_CLIENT } from "../../constants";

type CollectionStats = {
  id: string;
  desc: string;
  img: string;
  website: string;
  floor_price: number;
};

/**
 * Provides a feed of NFT collections that the user can afford.
 */
async function hyperspaceGetCollectionsByFloorPrice(
  maxFloorPrice: number | undefined,
  minFloorPrice: number | undefined,
  pageSize: number = 5,
  orderBy: string = "DESC",
  humanReadableSlugs: boolean = false
) {
  let pageNumber = 1;
  let results: CollectionStats[] = [];
  let hasMore = true;
  while (results.length < pageSize && hasMore) {
    let projects = await HYPERSPACE_CLIENT.getProjects({
      condition: {
        floorPriceFilter: {
          min: minFloorPrice ?? null,
          max: maxFloorPrice ?? null,
        },
      },
      orderBy: {
        field_name: "floor_price",
        sort_order: orderBy as any,
      },
      paginationInfo: {
        page_size: 512,
        page_number: pageNumber,
      },
    });

    let stats: CollectionStats[] =
      projects.getProjectStats.project_stats
        ?.filter((project) => {
          return (
            (project.volume_7day ?? 0 > 0) && (project.floor_price ?? 0 > 0)
          );
        })
        .map((project) => {
          return {
            id: project.project_id,
            desc: project.project?.display_name ?? "",
            img: project.project?.img_url ?? "",
            website: project.project?.website ?? "",
            floor_price: project.floor_price ?? 0,
          };
        }) ?? [];

    if (humanReadableSlugs) {
      stats = stats?.filter((stat) => {
        try {
          bs58.decode(stat.id!);
          return false;
        } catch (err) {
          return true;
        }
      });
    }
    pageNumber += 1;
    console.log("\tFetching collection info... ", stats.length, pageNumber);
    results = results.concat(stats!);
    hasMore = projects.getProjectStats.pagination_info.has_next_page;
  }

  return {
    projects: results.slice(0, pageSize),
    hasMore: hasMore,
  };
}

export async function getCollectionsByFloorPrice(req: Request, res: Response) {
  const { maxFloorPrice, minFloorPrice, orderBy, pageSize, humanReadable } =
    req.body;
  const result = await hyperspaceGetCollectionsByFloorPrice(
    maxFloorPrice,
    minFloorPrice,
    pageSize,
    orderBy,
    humanReadable
  );
  res.status(200).send(JSON.stringify(result));
}
