const STOPWORDS = new Set(['the','is','at','which','on','a','an','and','or','but','in','with','to','for','of','not','no','can','had','has','his','her','she','they','this','that','from','are','was','were','be','been','being','have','have','it','its','as','by','do','did','if','into','just','may','my','now','old','our','out','own','say','too','use','very','will','with','you','your']);

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

export function indexDocument(docId, text) {
    const words = tokenize(text);
    docIndex.set(docId, computeTF(words));
}

export function removeDocument(docId) {
    docIndex.delete(docId);
}

export function search(query, userId, docs, limit = 5) {
    const queryWords = tokenize(query);
    if (queryWords.length === 0) return [];
    const queryTF = computeTF(queryWords);
    const scores = [];
    for (const doc of docs) {
        const docTF = docIndex.get(doc.id);
        if (!docTF) continue;
        let dot = 0, qMag = 0, dMag = 0;
        for (const w of queryTF) {
            if (docTF[w]) dot += queryTF[w] * docTF[w];
        }
        for (const w in queryTF) qMag += queryTF[w] ** 2;
        for (const w in docTF) dMag += docTF[w] ** 2;
        const sim = (qMag && dMag) ? dot / (Math.sqrt(qMag) * Math.sqrt(dMag)) : 0;
        if (sim > 0) {
            const snippet = doc.content_text.substring(0, 200).trim();
            scores.push({ id: doc.id, filename: doc.filename, score: sim, snippet });
        }
    }
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, limit);
}
