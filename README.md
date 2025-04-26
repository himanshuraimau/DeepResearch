# DeepResearch

DeepResearch is a web application that performs in-depth research on user queries, generating comprehensive reports based on the findings. The application allows users to configure the depth and breadth of research to control the scope of investigation.

## Features

- Web-based interface for submitting research queries
- Configurable research depth and breadth
- Automatic report generation in Markdown format
- RESTful API for programmatic access
- CORS-enabled for cross-origin requests
- Static file serving for frontend assets

## Prerequisites

- Node.js (v14 or higher recommended)
- pnpm package manager

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd DeepResearch
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

## Project Structure

```
DeepResearch/
├── src/
│   ├── index.ts          # Main application entry point
│   └── DeepResearch.ts   # Core research functionality
├── frontend/             # Frontend static files
└── package.json
```

## Usage

1. Start the server:

    ```bash
    pnpm start
    ```

2. Access the application at `http://localhost:3000`

3. Submit research queries through the web interface or API

### API Endpoints

#### POST /api/research
Submit a research query with optional depth and breadth parameters.

Request body:
```json
{
    "query": "Your research query",
    "depth": 1,    // Optional, defaults to 1
    "breadth": 1   // Optional, defaults to 1
}
```

Response:
```json
{
    "searchResults": [...],
    "report": "Generated markdown report"
}
```

## Environment Variables

- `PORT`: Server port number (defaults to 3000)
