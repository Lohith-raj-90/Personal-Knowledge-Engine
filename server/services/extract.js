import { readFileSync } from 'fs';

export async function extractText(filePath, fileType) {
    try {
        if (fileType === 'pdf') {
            const pdfParse = (await import('pdf-parse')).default;
            const dataBuffer = readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return { text: data.text, pageCount: data.numpages || 0 };
        }
        if (fileType === 'docx') {
            const mammoth = await import('mammoth');
            const result = await mammoth.extractRawText({ path: filePath });
            return { text: result.value, pageCount: 1 };
        }
        if (fileType === 'txt') {
            const text = readFileSync(filePath, 'utf-8');
            return { text, pageCount: 1 };
        }
        return { text: '', pageCount: 0 };
    } catch {
        return { text: '', pageCount: 0 };
    }
}
