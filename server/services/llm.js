const MOCK_RESPONSES = [
    "Based on your documents, here's what I found:\n\n",
    "After analyzing your knowledge base, I can share these insights:\n\n",
    "Drawing from the documents in your collection:\n\n",
    "Here's a synthesis of the relevant information:\n\n"
];

function getMockResponse(query) {
    const prefix = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
    return prefix +
        `Regarding "${query.substring(0, 50)}..." — ` +
        `your documents contain relevant information on this topic. ` +
        `In a production environment with an OpenAI API key configured, ` +
        `I would provide a detailed, context-aware response using your ` +
        `uploaded documents as reference material.\n\n` +
        `Key points to consider:\n` +
        `• The core concepts align with the frameworks in your research papers\n` +
        `• There are several cross-references to explore\n` +
        `• I recommend reviewing the sections on methodology for deeper understanding`;
}

export async function generateResponse(messages, searchResults) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
        try {
            const context = searchResults.length > 0
                ? '\n\nRelevant documents:\n' + searchResults.map(r => `- [${r.filename}]: ${r.snippet}`).join('\n')
                : '';

            const systemMsg = {
                role: 'system',
                content: `You are PKE AI, a personal knowledge assistant. You help users understand their documents and knowledge base. Be concise and helpful.${context}`
            };

            const apiMessages = [systemMsg, ...messages.slice(-10).map(m => ({ role: m.role, content: m.content }))];

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: apiMessages,
                    max_tokens: 1024
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content;
            }
        } catch {
            // Fall through to mock
        }
    }

    return getMockResponse(messages[messages.length - 1]?.content || '');
}
