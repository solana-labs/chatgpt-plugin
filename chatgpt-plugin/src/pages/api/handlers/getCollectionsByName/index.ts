import { NextApiRequest, NextApiResponse } from "next";
import configConstants, { HYPERSPACE_CLIENT } from "../../constants";
configConstants();

async function getCollectionsByName(req: NextApiRequest, res: NextApiResponse) {
  const { projectName } = req.body;
  const projects = await HYPERSPACE_CLIENT.searchProjectByName({
    condition: {
      // In practice, it was harder to find projects based on this condition
      //   matchName: {
      //     operation: "FUZZY" as StringInputOperationEnum.Fuzzy,
      //     value: projectName as string,
      //   },
      name: projectName as string,
    },
  });
  const paredResponse =
    projects.getProjectStatByName.project_stats
      ?.map((project) => {
        return {
          id: project.project_id,
          verified: project.project?.is_verified ?? false,
          name: project.project?.display_name ?? "",
          img: project.project?.img_url ?? "",
          website: project.project?.website ?? "",
          floorPrice: project.floor_price ?? 0,
          twitterFollowers: project.twitter_followers ?? 0,
          twitter: project.project?.twitter ?? "",
        };
      })
      .filter((project) => project.verified) ?? [];
  const result = {
    projects: paredResponse,
  };

  res.status(200).send(JSON.stringify(result));
}

export default getCollectionsByName;
