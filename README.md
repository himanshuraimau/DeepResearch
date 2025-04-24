# AI Research Assistant

An AI-powered tool to automate web research, analyze data, and generate detailed reports.

## Features

- Web search and content extraction
- AI-based analysis and summarization
- Markdown report generation

## Tech Stack

- TypeScript
- Node.js
- pnpm
- AI SDK
- Zod, Exa

## Setup

1. Clone the repository:

    ```bash
    git clone <repository_url>
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Add your API keys in a `.env` file:

    ```
    OPENAI_API_KEY=your_openai_api_key
    GOOGLE_API_KEY=your_google_api_key
    EXA_API_KEY=your_exa_api_key
    ```

4. Start the project:

    ```bash
    pnpm start
    ```

The report will be saved as `report.md`.
