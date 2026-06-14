const STOPWORDS = new Set(['the','is','at','which','on','a','an','and','or','but','in','with','to','for','of','not','no','can','had','has','his','her','she','they','this','that','from','are','was','were','be','been','being','have','it','its','as','by','do','did','if','into','just','may','my','now','old','our','out','own','say','too','use','very','will','with','you','your']);

function tokenize(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

function computeTF(words) {
    const tf = {};
    for (const w of words) tf[w] = (tf[w] || 0) + 1;
    const len = words.length || 1;
    for (const w in tf) tf[w] /= len;
    return tf;
}

const docIndex = new Map();
const docWordCounts = new Map(); // docId -> Set of unique words (for IDF)
let totalDocs = 0;

export function isIndexed(docId) {
    return docIndex.has(docId);
}

export function indexDocument(docId, text) {
    const words = tokenize(text);
    docIndex.set(docId, computeTF(words));
    docWordCounts.set(docId, new Set(words));
    totalDocs = docIndex.size;
}

export function removeDocument(docId) {
    docIndex.delete(docId);
    docWordCounts.delete(docId);
    totalDocs = docIndex.size;
}

/** Compute IDF: log(N / df) where df = number of docs containing the term */
function computeIDF(word) {
    let df = 0;
    for (const [, words] of docWordCounts) {
        if (words.has(word)) df++;
    }
    return df > 0 ? Math.log((totalDocs + 1) / (df + 1)) + 1 : 1;
}

export function search(query, userId, docs, limit = 5) {
    const queryWords = tokenize(query);
    if (queryWords.length === 0) return [];
    const queryTF = computeTF(queryWords);

    // Compute TF-IDF weights for query
    const queryWeights = {};
    const queryIDFs = {};
    for (const w in queryTF) {
        queryIDFs[w] = computeIDF(w);
        queryWeights[w] = queryTF[w] * queryIDFs[w];
    }

    // Pre-compute query magnitude (constant across all docs)
    let qMag = 0;
    for (const w in queryWeights) qMag += queryWeights[w] * queryWeights[w];

    const scores = [];
    for (const doc of docs) {
        const docTF = docIndex.get(doc.id);
        if (!docTF) continue;

        // Compute TF-IDF cosine similarity
        let dot = 0, dMag = 0;
        for (const w in queryWeights) {
            const docWeight = (docTF[w] || 0) * queryIDFs[w];
            dot += queryWeights[w] * docWeight;
            dMag += docWeight * docWeight;
        }

        const sim = (qMag && dMag) ? dot / (Math.sqrt(qMag) * Math.sqrt(dMag)) : 0;
        if (sim > 0) {
            const snippet = extractSnippet(doc.content_text, queryWords);
            scores.push({ id: doc.id, filename: doc.filename, score: sim, snippet });
        }
    }
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, limit);
}

/** Extract a relevant snippet from text around the first matching query term */
function extractSnippet(text, queryWords) {
    if (!text) return '';
    const lower = text.toLowerCase();
    for (const word of queryWords) {
        const idx = lower.indexOf(word);
        if (idx !== -1) {
            const start = Math.max(0, idx - 60);
            const end = Math.min(text.length, idx + 140);
            let snippet = text.substring(start, end).trim();
            if (start > 0) snippet = '...' + snippet;
            if (end < text.length) snippet = snippet + '...';
            return snippet;
        }
    }
    return text.substring(0, 200).trim();
}
