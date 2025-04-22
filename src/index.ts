import "dotenv/config";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const main = async () => {
    const result = await generateObject({
        model: openai('gpt-3.5-turbo'),
        prompt: "Come up with a 10 definiations of ai agents",
        schema: z.object({
            definitions: z.array(z.string().describe("A definition of an AI agent and use as much as jargon as possible")),
        }),
    });
    console.log(result.object.definitions);
};

main();