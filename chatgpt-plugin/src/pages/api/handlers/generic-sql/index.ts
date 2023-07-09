import { Flipside, Query, QueryResultSet } from "@flipsidecrypto/sdk";
import {
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import { NextApiRequest, NextApiResponse } from "next";
import { encoding_for_model } from "tiktoken";
import type { TiktokenModel } from "tiktoken";
import * as util from "util";

import {
  getText2SqlExampleMessages,
  enrichPromptForFewShotInference,
} from "./prompt";
import type { IMessage } from "./prompt";
import tablesCore from "./tables-flipside";

const modelName: TiktokenModel = "text-davinci-003";
const DIALECT = "PostgreSQL 15.2"; // or 'MySQL'

function getTablesInMachinePromptForm(tableNames: string[]): string {
  return tablesCore
    .map((table) => {
      const tableName = `table name: ${table.name}`;
      const tableDescription = `table description: ${table.description}`;
      const tableColumns = table.columns.map(
        (column) => `${column.name} ${column.type} ${column.description}`
      );
      return [tableName, tableDescription, ...tableColumns].join("\n");
    })
    .join("\n\n");
}

async function getAssistantMessageFromOpenAi(
  messages: IMessage[],
  modelName: TiktokenModel
): Promise<ChatCompletionResponseMessage> {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const completion = await openai.createChatCompletion({
    // model: modelName,
    // https://platform.openai.com/docs/models/model-endpoint-compatibility
    // Available: gpt-4, gpt-4-0314, gpt-4-32k, gpt-4-32k-0314, gpt-3.5-turbo, gpt-3.5-turbo-0301
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0,
  });

  if (completion.data.choices.length === 0)
    throw new Error("No response from OpenAI");
  return completion.data.choices[0].message as ChatCompletionResponseMessage;
}

// Takes a natural language prompt and try to generate a valid SQL to answer it `retries` times
async function promptToSqlWithRetry(
  prompt: string,
  retries = 3
): Promise<string> {
  const encoder = encoding_for_model(modelName);

  const tableNames = tablesCore.map((table) => table.name);
  const tablePrompt = getTablesInMachinePromptForm(tableNames);

  const schemaMessage: IMessage[] = [
    { role: "user", content: tablePrompt },
  ];

  const instLen = encoder.encode(tablePrompt).length; // Instruction Length
  const exampleMessages = getText2SqlExampleMessages(instLen);
  console.log('exampleMessages', exampleMessages)

  const messageHistory: IMessage[] = [
    { role: "user", content: enrichPromptForFewShotInference(prompt, DIALECT) },
  ];
  console.log('messageHistory', messageHistory)

  let assistantMessage: ChatCompletionResponseMessage;
  let sqlQuery = "";

  // Try to generate SQL query from prompt for `retries` times
  for (let k = 0; k < retries; k++) {
    try {
      try {
        let payload = schemaMessage.concat(messageHistory);
        if (k === 0) payload = exampleMessages.concat(payload);
        assistantMessage = await getAssistantMessageFromOpenAi(
          payload,
          modelName
        );

        // Try to convert OpenAI's output to JSON and extract `SQL` field.
        // If it fails, try again. Otherwise, use the SQL query.
        sqlQuery = JSON.parse(assistantMessage.content).SQL as string;
        if (sqlQuery) break;
      } catch (e) {
        // ignore, don't handle error
        console.log((e as any).toJSON());
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  if (sqlQuery === "") {
    throw new Error("Could not generate SQL query from prompt");
  }

  // release encoder
  encoder.free();
  return sqlQuery;
}

async function dispatchSqlQueryFlipside(
  sqlQuery: string
): Promise<QueryResultSet | undefined> {
  try {
    // Initialize `Flipside` with your API key
    const flipside = new Flipside(
      process.env.FLIPSIDE_CRYPTO_API_KEY as string,
      "https://api-v2.flipsidecrypto.xyz"
    );

    const query: Query = {
      sql: sqlQuery,
      maxAgeMinutes: 1,
    };

    return flipside.query.run(query);
  } catch (error) {
    console.log(util.inspect((error as any).response.data, false, null, true));
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  let prompt = req.body.prompt;
  if (!prompt) {
    res.status(400).send({ message: "Missing prompt" });
    return;
  }

  try {
    const sqlQuery = await promptToSqlWithRetry(prompt, 3);
    // console.log("sqlQuery", sqlQuery);

    const data = await dispatchSqlQueryFlipside(sqlQuery);
    // console.log(data);

    res.status(200).send({ message: data });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: true, message: "Internal server error" });
    return;
  }
}
