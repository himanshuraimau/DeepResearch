# DeepResearch

A modern web application for conducting in-depth research on user queries, featuring a clean glassmorphic interface and real-time results display.

## Features

- 🔍 **Intelligent Research**: Conduct deep research on any topic with configurable depth and breadth
- 🎨 **Modern UI**: Clean, glassmorphic design with a split-pane layout
- 📝 **Real-time Results**: Instant display of research findings
- 💾 **Save Functionality**: Download research results as text files
- ⚡ **Responsive Design**: Works seamlessly on all device sizes
- 🎯 **User-friendly Controls**: Intuitive interface for adjusting research parameters

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Glassmorphic UI design
- Responsive layout
- Inter font family

### Backend
- Node.js with Express
- TypeScript for type safety
- AI-powered research using:
  - Google Gemini
  - Exa search API
  - OpenAI integration

## Prerequisites

- Node.js (v14 or higher)
- pnpm package manager
- API keys for:
  - EXA_API_KEY
  - Google Gemini
  - OpenAI (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DeepResearch.git
   cd DeepResearch
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   EXA_API_KEY=your_exa_api_key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Enter your research query in the search box
2. Adjust the depth and breadth parameters:
   - Depth: Controls how deep the research goes (1-5)
   - Breadth: Controls how many different aspects to explore (1-5)
3. Click "Research" to start the analysis
4. View results in the right pane
5. Use the "Save Results" button to download findings

## API Endpoints

### POST /api/research
Submit a research query with optional parameters.

**Request Body:**
```json
{
    "query": "Your research query",
    "depth": 1,    // Optional, defaults to 1
    "breadth": 1   // Optional, defaults to 1
}
```

**Response:**
```json
{
    "searchResults": [
        {
            "title": "Result title",
            "url": "Source URL",
            "content": "Content snippet"
        }
    ],
    "report": "Generated research report"
}
```

## Project Structure

```
DeepResearch/
├── src/
│   ├── index.ts          # Main application entry point
│   └── DeepResearch.ts   # Core research functionality
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── styles.css        # Styling
│   └── app.js           # Frontend logic
├── public/              # Static assets
└── package.json
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by modern glassmorphic UI trends
- Built with vanilla JavaScript for optimal performance
- Special thanks to the open-source community
