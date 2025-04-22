import "dotenv/config";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import Exa from 'exa-js'
import { url } from "inspector";


const exa = new Exa(process.env.EXA_API_KEY)

type SearchResult = {
    title: string;
    url: string;
    content: string;
}

const searchWeb = async (query: string) => {
    const { results } = await exa.searchAndContents(query, {
        numResults: 3,
        livecrawl: 'always',
    })

    return results.map((result) => ({
        title: result.title,
        url: result.url,
        content: result.text
    }) as SearchResult
    )


}
const mainModel = openai("gpt-4o");

const generateSearchQueries = async (query: string, n: number) => {
    const {
        object: { queries }
    } = await generateObject({
        model: mainModel,
        prompt: `Generate ${n} search queries for the following query: ${query}`,
        schema: z.object({
            queries: z.array(z.string()).min(1).max(n)
        })
    });
    return queries;
}


const serachAndProcess = async (query: string) => {
    const pendingSearchResults: SearchResult[] = [];
    const finalSearchResults: SearchResult[] = [];

    await generateText({
        model: mainModel,
        prompt: `Search the web for the following query: ${query}`,
        system:
            'You are a researcher. For each query,search the web and then evaluate the results if they are relevant to the query. If they are relevant and help answer the following query',
        maxSteps: 5,
        tools: {
            searchWeb: {
                description: 'Search the web for the given query',
                parameters: z.object({
                    query: z.string().min(1)
                }),
                async execute({ query }) {
                    const results = await searchWeb(query);
                    pendingSearchResults.push(...results);
                    return results;
                },
            }
        },


    })

}




const main = async () => {
    const prompt = 'What do you need to be a D1 shotup athlete?';
    const searchQueries = await generateSearchQueries(prompt, 3);
    console.log('Search Queries:', searchQueries);
}

main()