document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('query');
    const depthInput = document.getElementById('depth');
    const breadthInput = document.getElementById('breadth');
    const depthValue = document.getElementById('depthValue');
    const breadthValue = document.getElementById('breadthValue');
    const searchBtn = document.getElementById('searchBtn');
    const saveBtn = document.getElementById('saveBtn');
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const reportDiv = document.getElementById('report');

    // Update range input values
    depthInput.addEventListener('input', () => {
        depthValue.textContent = depthInput.value;
    });

    breadthInput.addEventListener('input', () => {
        breadthValue.textContent = breadthInput.value;
    });

    // Convert markdown to plain text
    function markdownToText(markdown) {
        return markdown
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
            .replace(/`(.*?)`/g, '$1') // Remove code
            .replace(/\n\s*[-*+]\s/g, '\n• ') // Convert lists to bullet points
            .replace(/\n\s*\d+\.\s/g, '\n• ') // Convert numbered lists to bullet points
            .replace(/\n{3,}/g, '\n\n') // Remove extra newlines
            .trim();
    }

    // Save results to file
    function saveResults(text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `research-results-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Handle search button click
    searchBtn.addEventListener('click', async () => {
        const query = queryInput.value.trim();
        if (!query) {
            alert('Please enter a research query');
            return;
        }

        // Show loading state
        loadingDiv.classList.remove('hidden');
        resultsDiv.classList.add('hidden');
        searchBtn.disabled = true;
        saveBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    depth: parseInt(depthInput.value),
                    breadth: parseInt(breadthInput.value)
                })
            });

            if (!response.ok) {
                throw new Error('Research request failed');
            }

            const data = await response.json();
            
            // Convert markdown to plain text and display
            const plainText = markdownToText(data.report);
            reportDiv.textContent = plainText;
            resultsDiv.classList.remove('hidden');
            saveBtn.disabled = false;
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            loadingDiv.classList.add('hidden');
            searchBtn.disabled = false;
        }
    });

    // Handle save button click
    saveBtn.addEventListener('click', () => {
        const text = reportDiv.textContent;
        if (text) {
            saveResults(text);
        }
    });

    // Handle enter key in search input
    queryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}); 