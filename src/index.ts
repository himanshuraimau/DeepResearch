import "dotenv/config";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import Exa from "exa-js";
import fs from "fs";

type Learning = {
    learning: string;
    followUpQuestions: string[];
};

type SearchResult = {
    title: string;
    url: string;
    content: string;
};

type Research = {
    query: string | undefined;
    queries: string[];
    searchResults: SearchResult[];
    learnings: Learning[];
    completedQueries: string[];
};

const accumulatedResearch: Research = {
    query: undefined,
    queries: [],
    searchResults: [],
    learnings: [],
    completedQueries: [],
};

const exa = new Exa(process.env.EXA_API_KEY);
const mainModel = google("gemini-2.0-flash-001");

const SYSTEM_PROMPT = `You are an expert research analyst specializing in providing comprehensive insights. Today is ${new Date().toISOString()}. Follow these guidelines:
- Maintain academic rigor while synthesizing information from multiple sources
- Provide evidence-based analysis with specific data points when available
- Highlight emerging trends and potential future developments
- Include contrarian viewpoints and alternative perspectives
- Structure information in a clear, hierarchical format using headers
- Flag any speculative conclusions or forward-looking statements
- Use markdown tables for comparing data points
- Include relevant metrics and quantitative data where applicable
- Cite specific examples to support key points
- Identify potential limitations or gaps in the available information`;

const searchWeb = async (query: string): Promise<SearchResult[]> => {
    const { results } = await exa.searchAndContents(query, {
        numResults: 3,
        livecrawl: "always",
    });

    return results.map(
        (result) =>
            ({
                title: result.title,
                url: result.url,
                content: result.text,
            } as SearchResult)
    );
};

const generateSearchQueries = async (query: string, n: number): Promise<string[]> => {
    const {
        object: { queries },
    } = await generateObject({
        model: mainModel,
        prompt: `Based on the research topic: "${query}"
Generate ${n} specific search queries that will:
- Cover different aspects of the topic
- Include technical and specialized terminology
- Target authoritative sources
- Focus on recent developments
- Address potential controversies or debates
Please provide the most effective search queries to gather comprehensive information.`,
        schema: z.object({
            queries: z.array(z.string()).min(1).max(n),
        }),
    });
    return queries;
};

const generateLearnings = async (query: string, searchResult: SearchResult): Promise<Learning> => {
    const { object } = await generateObject({
        model: mainModel,
        prompt: `Analyze the following search result for the research topic "${query}":

<search_result>
${JSON.stringify(searchResult)}
</search_result>

Extract key insights and generate follow-up questions that:
1. Explore deeper aspects of the topic
2. Challenge assumptions in the source material
3. Investigate practical applications
4. Address potential gaps in the information

Format the learning as a concise summary and provide 2-3 specific follow-up questions.`,
        schema: z.object({
            learning: z.string(),
            followUpQuestions: z.array(z.string()),
        }),
    });
    return object;
};

const generateReport = async (research: Research): Promise<string> => {
    const { text } = await generateText({
        model: mainModel,
        system: SYSTEM_PROMPT,
        prompt: "Generate a report based on the following research data:\n\n" + JSON.stringify(research, null, 2),
    });
    return text;
};

const searchAndProcess = async (
    query: string,
    accumulatedSources: SearchResult[]
): Promise<SearchResult[]> => {
    const pendingSearchResults: SearchResult[] = [];
    const finalSearchResults: SearchResult[] = [];

    await generateText({
        model: mainModel,
        prompt: `Search the web for information about ${query}`,
        system:
            "You are a researcher. For each query, search the web and then evaluate if the results are relevant and will help answer the following query",
        maxSteps: 5,
        tools: {
            searchWeb: {
                description: "Search the web for information about a given query",
                parameters: z.object({
                    query: z.string().min(1),
                }),
                async execute({ query }) {
                    const results = await searchWeb(query);
                    pendingSearchResults.push(...results);
                    return results;
                },
            },
            evaluate: {
                description: "Evaluate the search results",
                parameters: z.object({}),
                async execute() {
                    const pendingResult = pendingSearchResults.pop()!;
                    const { object: evaluation } = await generateObject({
                        model: mainModel,
                        prompt: `Evaluate whether the search results are relevant and will help answer the following query: ${query}. If the page already exists in the existing results, mark it as irrelevant.

<search_results>
${JSON.stringify(pendingResult)}
</search_results>

<existing_results>
${JSON.stringify(accumulatedSources.map((result) => result.url))}
</existing_results>
`,
                        output: "enum",
                        enum: ["relevant", "irrelevant"],
                    });
                    if (evaluation === "relevant") {
                        finalSearchResults.push(pendingResult);
                    }
                    console.log("Found:", pendingResult.url);
                    console.log("Evaluation completed:", evaluation);
                    return evaluation === "irrelevant"
                        ? "Search results are irrelevant. Please search again with a more specific query."
                        : "Search results are relevant. End research for this query.";
                },
            },
        },
    });

    return finalSearchResults;
};

const deepResearch = async (
    prompt: string,
    depth: number = 1,
    breadth: number = 1
): Promise<Research> => {
    if (!accumulatedResearch.query) {
        accumulatedResearch.query = prompt;
    }

    if (depth === 0) {
        return accumulatedResearch;
    }

    const queries = await generateSearchQueries(prompt, breadth);
    accumulatedResearch.queries = queries;

    for (const query of queries) {
        console.log(`Searching the web for: ${query}`);
        const searchResults = await searchAndProcess(query, accumulatedResearch.searchResults);
        accumulatedResearch.searchResults.push(...searchResults);

        for (const searchResult of searchResults) {
            console.log(`Processing search result: ${searchResult.url}`);
            const learnings = await generateLearnings(query, searchResult);
            accumulatedResearch.learnings.push(learnings);
            accumulatedResearch.completedQueries.push(query);

            const newQuery = `Overall research goal: ${prompt}
Previous search queries: ${accumulatedResearch.completedQueries.join(", ")}

Follow-up questions: ${learnings.followUpQuestions.join(", ")}
`;
            await deepResearch(newQuery, depth - 1, Math.ceil(breadth / 2));
        }
    }
    return accumulatedResearch;
};

const main = async () => {
    const research = await deepResearch("What do you need to be a D1 shotput athlete?");
    console.log("Research completed!");
    console.log("Generating report...");
    const report = await generateReport(research);
    console.log("Report generated! report.md");
    fs.writeFileSync("report.md", report);
};

main();
