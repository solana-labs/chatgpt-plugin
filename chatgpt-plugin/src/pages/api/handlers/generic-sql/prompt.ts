import { v4 as uuidv4 } from "uuid";

import { examplesText2Sql } from "./examples";

// FROM: https://github.com/caesarHQ/textSQL/blob/main/api/app/api/utils/sql_gen/prompts.py#L145
// Crates the retry prompt for the given scope formatted to the given dialect and schemas.
export function enrichPromptForFewShotInference(prompt: string, dialect: string): string {
  return `
generation_id: ${uuidv4()}
You are an expert and empathetic database engineer that is generating correct read-only ${dialect} query to answer the following question/command: ${prompt}

- Use state abbreviations for states.
- Table crime_by_city does not have columns 'zip_code' or 'county'.
- Do not use ambiguous column names.
- For example, city can be ambiguous because both tables location_data and crime_by_city have a column named city. Always specify the table where you are using the column.
- If you include a city or county column in the result table, include a state column too.
- Make sure each value in the result table is not null.
- Use CTE format for computing subqueries.

Provide a properly formatted JSON object with the following information. Ensure to escape any special characters (e.g. \n should be \\n, \m \\m and such) so it can be parsed as JSON.
{{
    "Schema": "<1 to 2 sentences about the tables/columns/enums above to use>",
    "SQL": "<your query>"
}}

Command: ${prompt}
`;
}

export interface IMessage {
  role: "user" | "assistant";
  content: string;
}

export function getText2SqlExampleMessages(instLen: number): IMessage[] {
  // const maxMessages = instLen > 1000 ? 5 : instLen > 1500 ? 2 : instLen > 2000 ? 1 : -1;

  // For now, just use all examples
  let examples = examplesText2Sql;

  // if (maxMessages > 0) {
  //   examples = examplesText2Sql.slice(0, maxMessages);
  // }

  const messages: IMessage[] = [];
  for (const example of examples) {
    messages.push({ role: "user", content: example.user });
    messages.push({ role: "assistant", content: example.assistant });
  }

  return messages;
}
