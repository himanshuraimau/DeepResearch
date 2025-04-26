import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { deepResearch, generateReport } from './DeepReserach';

const app = express();
const frontendPath = path.join(__dirname, '../frontend');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(frontendPath));

interface ResearchRequest {
    query: string;
    depth?: number;
    breadth?: number;
}

app.post('/api/research', async (req: Request<{}, {}, ResearchRequest>, res: Response) => {
    const { query, depth, breadth } = req.body;
    if (!query) {
        console.log('[API] Received research request with missing query');
        return res.status(400).json({ error: 'Query is required' });
    }
    console.log(`[API] Received research request: query="${query}", depth=${depth || 1}, breadth=${breadth || 1}`);
    try {
        console.log('[API] Calling deepResearch...');
        const research = await deepResearch(query, depth || 1, breadth || 1);
        console.log('[API] deepResearch completed. Generating report...');
        const report = await generateReport(research);
        
        res.json({ searchResults: research.searchResults, report });
        console.log('[API] Report generated and response sent.');
    } catch (err) {
        console.error('[API] Error in /api/research:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
    }
});

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`DeepResearch app listening on port ${port}!`);
});
