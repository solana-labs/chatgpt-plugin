const examplesText2Sql = [
  // Domain-specific
  {
    user: "Most expensive NFT sale",
    assistant:
      "SELECT seller, mint, sales_amount FROM solana.core.fact_nft_sales WHERE sales_amount IS NOT NULL ORDER BY sales_amount DESC LIMIT 1;",
  },
  {
    user: "Mint price and purchaser of the 10 latest NFT mints",
    assistant:
      "SELECT mint, mint_price, PURCHASER FROM solana.core.fact_nft_mints DESC LIMIT 10;",
  },
  {
    user: "What are the highest priced NFTs in the last 30 days?",
    assistant:
      "SELECT mint, MAX(sales_amount) as max_nft_price FROM solana.core.fact_nft_sales WHERE block_timestamp > CURRENT_DATE - interval '30 days';",
  },
  //
  // WITH yesterday_sales AS (
  //     SELECT *
  //     FROM solana.core.fact_nft_sales
  //     WHERE
  //       block_timestamp >= CURRENT_DATE - interval '1 day'
  //       AND block_timestamp < CURRENT_DATE
  //       AND sales_amount IS NOT NULL
  // )
  // SELECT seller, mint, sales_amount
  // FROM yesterday_sales
  // ORDER BY sales_amount DESC;
  {
    user: "NFT sales yesterday",
    assistant:
      "WITH yesterday_sales AS( SELECT * FROM solana.core.fact_nft_sales WHERE block_timestamp >= CURRENT_DATE - interval '1 day' AND block_timestamp < CURRENT_DATE AND sales_amount IS NOT NULL) SELECT seller, mint, sales_amount FROM yesterday_sales ORDER BY sales_amount DESC;",
  },
  //
  // SELECT seller, sales_amount, block_timestamp
  // FROM (
  // SELECT seller, sales_amount, fact_nft_sales.block_timestamp
  // FROM solana.core.fact_nft_sales as fact_nft_sales
  // INNER JOIN solana.core.fact_nft_mints as fact_nft_mints
  // ON fact_nft_sales.mint = fact_nft_mints.mint
  // WHERE fact_nft_sales.mint = ANY(
  //     SELECT mint
  //     FROM solana.core.dim_nft_metadata
  //     WHERE project_name = 'Solana Monkey Business'
  // )
  // AND fact_nft_sales.sales_amount IS NOT NULL
  // )
  // ORDER BY sales_amount DESC
  // LIMIT 10;
  {
    user: "Top sales for Solana Monkey Business",
    assistant:
      "SELECT seller, sales_amount, block_timestamp FROM( SELECT seller, sales_amount, fact_nft_sales.block_timestamp FROM solana.core.fact_nft_sales as fact_nft_sales INNER JOIN solana.core.fact_nft_mints as fact_nft_mints ON fact_nft_sales.mint = fact_nft_mints.mint WHERE fact_nft_sales.mint = ANY( SELECT mint FROM solana.core.dim_nft_metadata WHERE project_name = 'Solana Monkey Business') AND fact_nft_sales.sales_amount IS NOT NULL ) ORDER BY sales_amount DESC LIMIT 10;",
  },
  //
  // SELECT seller, mint, sales_amount
  // FROM solana.core.fact_nft_sales
  // WHERE
  // sales_amount = (
  //     SELECT MAX(sales_amount)
  //     FROM solana.core.fact_nft_sales
  //     WHERE block_timestamp > CURRENT_DATE - interval '30 days' AND sales_amount IS NOT NULL
  // )
  // ORDER BY block_timestamp DESC
  // LIMIT 1;
  {
    user: "Who sold the most expensive NFT in the last 30 days? What was the price?",
    assistant:
      "SELECT seller, mint, sales_amount FROM solana.core.fact_nft_sales WHERE sales_amount =( SELECT MAX(sales_amount) FROM solana.core.fact_nft_sales WHERE block_timestamp > CURRENT_DATE - interval '30 days' AND sales_amount IS NOT NULL) ORDER BY block_timestamp DESC LIMIT 1;",
  },
  //
  // SELECT purchaser, SUM(sales_amount) as spent_amount
  // FROM solana.core.fact_nft_sales
  // WHERE block_timestamp > CURRENT_DATE - interval '7 days' AND sales_amount IS NOT NULL
  // GROUP BY purchaser
  // HAVING spent_amount > 100
  // ORDER BY spent_amount DESC;
  {
    user: "Who spend more than 100 SOL on buying NFTs last week?",
    assistant:
      "SELECT purchaser, SUM(sales_amount) as spent_amount FROM solana.core.fact_nft_sales WHERE block_timestamp > CURRENT_DATE - interval '7 days' AND sales_amount IS NOT NULL GROUP BY purchaser HAVING spent_amount > 100 ORDER BY spent_amount DESC;",
  },
  // SELECT seller, fact_nft_sales.mint, (fact_nft_sales.sales_amount - fact_nft_mints.mint_price) as price_difference
  // FROM solana.core.fact_nft_sales as fact_nft_sales
  // INNER JOIN solana.core.fact_nft_mints fact_nft_mints
  // ON fact_nft_sales.seller = fact_nft_mints.purchaser AND fact_nft_sales.sales_amount IS NOT NULL
  // ORDER BY price_difference DESC
  // LIMIT 3;
  {
    user: "What were the three highest NFT sales fron mint price?",
    assistant:
      "SELECT seller, fact_nft_sales.mint,(fact_nft_sales.sales_amount - fact_nft_mints.mint_price) as price_difference FROM solana.core.fact_nft_sales as fact_nft_sales INNER JOIN solana.core.fact_nft_mints fact_nft_mints ON fact_nft_sales.seller = fact_nft_mints.purchaser AND fact_nft_sales.sales_amount IS NOT NULL ORDER BY price_difference DESC LIMIT 3;",
  },
  //
  // SELECT
  //     seller,
  //     fact_nft_sales.mint,
  //     (fact_nft_sales.sales_amount - fact_nft_mints.mint_price) as flip_profit
  // FROM solana.core.fact_nft_sales as fact_nft_sales
  // INNER JOIN solana.core.fact_nft_mints fact_nft_mints
  // ON
  //     fact_nft_sales.seller = fact_nft_mints.purchaser
  //     AND fact_nft_sales.sales_amount IS NOT NULL
  //     AND fact_nft_sales.block_timestamp < fact_nft_mints.block_timestamp + interval '1 day'
  // ORDER BY flip_profit DESC
  // LIMIT 1;
  {
    user: "What is the most profitable flip within the day of minting an NFT?",
    assistant:
      "SELECT seller, fact_nft_sales.mint,(fact_nft_sales.sales_amount - fact_nft_mints.mint_price) as flip_profit FROM solana.core.fact_nft_sales as fact_nft_sales INNER JOIN solana.core.fact_nft_mints fact_nft_mints ON fact_nft_sales.seller = fact_nft_mints.purchaser AND fact_nft_sales.sales_amount IS NOT NULL AND fact_nft_sales.block_timestamp < fact_nft_mints.block_timestamp + interval '1 day' ORDER BY flip_profit DESC LIMIT 1;",
  },
  // Generic
  // {
  //   user: "What zip code has the highest percentage of people of age 75?",
  //   assistant:
  //     "SELECT location_data.zip_code, \\n       (population_by_age.population_75_to_84_years / total_population.total_population) * 100 AS percentage_75_to_84\\nFROM population_by_age\\nJOIN location_data ON population_by_age.geo_id = location_data.geo_id\\nJOIN total_population ON population_by_age.geo_id = total_population.geo_id\\nWHERE total_population.total_population > 0\\nORDER BY percentage_75_to_84 DESC NULLS LAST\\nLIMIT 1;",
  // },
  // {
  //   user: "Which 5 counties have the most arson?",
  //   assistant:
  //     "SELECT location_data.county, location_data.state, SUM(crime_by_city.arson) AS total_arson\\nFROM crime_by_city\\nJOIN location_data ON crime_by_city.city = location_data.city AND crime_by_city.state = location_data.state\\nWHERE crime_by_city.arson IS NOT NULL\\nGROUP BY location_data.county\\nORDER BY total_arson DESC NULLS LAST\\nLIMIT 5;",
  // },
  // {
  //   user: "Which 5 cities have the most females?",
  //   assistant:
  //     "SELECT location_data.city, location_data.state, population_by_gender.female_population\\nFROM location_data\\nJOIN population_by_gender ON location_data.geo_id = population_by_gender.geo_id\\nORDER BY population_by_gender.female_population DESC NULLS LAST\\nLIMIT 5;",
  // },
  // {
  //   user: "Which city in Washington has the highest population?",
  //   assistant:
  //     "SELECT location_data.city, location_data.state, \\n       SUM(population_by_gender.male_population) + SUM(population_by_gender.female_population) AS total_population\\nFROM location_data\\nJOIN population_by_gender ON location_data.geo_id = population_by_gender.geo_id\\nWHERE location_data.state = 'WA'\\nGROUP BY location_data.city, location_data.state\\nORDER BY total_population DESC NULLS LAST\\nLIMIT 1;",
  // },
  // {
  //   user: "Which zip code in San Francisco has the highest racial diversity and what is the percentage population of each race in that zip code?",
  //   assistant:
  //     "SELECT location_data.zip_code, \\n       (population_by_race.white_population / NULLIF(total_population.total_population, 0)) * 100 AS percentage_white,\\n       (population_by_race.black_population / NULLIF(total_population.total_population, 0)) * 100 AS percentage_black,\\n       (population_by_race.native_american_population / NULLIF(total_population.total_population, 0)) * 100 AS percentage_native_american,\\n       (population_by_race.asian_population / NULLIF(total_population.total_population, 0)) * 100 AS percentage_asian,\\n       (population_by_race.hispanic_population / NULLIF(total_population.total_population, 0)) * 100 AS percentage_hispanic,\\n       (population_by_race.two_or_more_population / NULLIF(total_population.total_population, 0)) * 100 AS percentage_two_or_more\\nFROM population_by_race\\nJOIN location_data ON population_by_race.geo_id = location_data.geo_id\\nJOIN (SELECT geo_id, SUM(white_population + black_population + native_american_population + asian_population + hispanic_population + two_or_more_population) AS total_population\\n      FROM population_by_race\\n      GROUP BY geo_id) AS total_population ON population_by_race.geo_id = total_population.geo_id\\nWHERE location_data.city = 'San Francisco' AND location_data.state = 'CA'\\nORDER BY (population_by_race.white_population + population_by_race.black_population + population_by_race.native_american_population + population_by_race.asian_population + population_by_race.hispanic_population + population_by_race.two_or_more_population) DESC NULLS LAST\\nLIMIT 1;",
  // },
  // {
  //   user: "Zip code in California with the most advanced degree holders",
  //   assistant:
  //     "SELECT location_data.zip_code, population_by_education_level.masters_degree + population_by_education_level.professional_school_degree + population_by_education_level.doctorate_degree AS total_advanced_degrees\\nFROM population_by_education_level\\nJOIN location_data ON population_by_education_level.geo_id = location_data.geo_id\\nWHERE location_data.state = 'CA'\\nORDER BY total_advanced_degrees DESC NULLS LAST\\nLIMIT 1;",
  // },
];

const examplesTableSelection = [
  {
    user: "Which top 5 cities have the most total crime?",
    assistant: '\n{\n    "tables": ["crime_by_city"]\n}\n',
  },
  {
    user: "What zip code has the highest percentage of people of age 75 and over?",
    assistant: '\n{\n    "tables": ["location_data", "population_by_age"]\n}\n',
  },
  {
    user: "Which 5 counties have the most arson?",
    assistant: '\n{\n    "tables": ["crime_by_city", "location_data"]\n}\n',
  },
  {
    user: "Which city has the most total crime and what is the racial makeup of that city?",
    assistant:
      '\n{\n    "tables": ["crime_by_city", "location_data", "population_by_race"]\n}\n',
  },
];

export { examplesText2Sql, examplesTableSelection };
