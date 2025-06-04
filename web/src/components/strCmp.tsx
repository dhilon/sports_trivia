// src/utils/stringUtils.js

// 1) Normalize: lowercase, remove non‐alphanumeric, collapse spaces
export function normalize(str: string) {
    return (
        str
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, "")      // strip punctuation
            .trim()
            .replace(/\s+/g, " ")             // collapse multiple spaces
    );
}

// 1b) (Optional) map number words → digits before normalization
//    Feel free to extend the map as needed.
const NUM_WORDS = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
    ten: "10",
    eleven: "11",
    twelve: "12",
    thirteen: "13",
    fourteen: "14",
    fifteen: "15",
    sixteen: "16",
    seventeen: "17",
    eighteen: "18",
    nineteen: "19",
    twenty: "20",
};

export function normalizeWithNumbers(str: string) {
    let s = str.toLowerCase();
    for (const [word, digit] of Object.entries(NUM_WORDS)) {
        // \b ensures whole‐word match
        s = s.replace(new RegExp(`\\b${word}\\b`, "g"), digit);
    }
    return normalize(s);
}


// 2) Compute Levenshtein distance
//    (classic DP algorithm)
export function levenshteinDistance(a: string, b: string) {
    const n = a.length;
    const m = b.length;
    // if one is empty, distance = length of the other
    if (n === 0) return m;
    if (m === 0) return n;

    // use a (m+1)‐length array for the "previous" row
    let prevRow = new Array(m + 1);
    for (let j = 0; j <= m; j++) {
        prevRow[j] = j;
    }

    for (let i = 1; i <= n; i++) {
        let currRow = new Array(m + 1);
        currRow[0] = i; // cost of deleting all of a[0..i-1]

        for (let j = 1; j <= m; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            currRow[j] = Math.min(
                prevRow[j] + 1,            // deletion
                currRow[j - 1] + 1,        // insertion
                prevRow[j - 1] + cost      // substitution
            );
        }

        prevRow = currRow;
    }
    return prevRow[m];
}


// 3) Similarity ratio: 1 - (distance / maxLen)
export function similarityRatio(a: string, b: string) {
    const dist = levenshteinDistance(a, b);
    const maxLen = Math.max(a.length, b.length);
    // If both are empty, consider them identical
    if (maxLen === 0) return 1;
    return 1 - dist / maxLen;  // between 0.0 and 1.0
}


// 4) Answer‐matching function (returns true if "close enough")
const THRESHOLD = 0.75;  // tweak as needed

export default function answersMatch(userAnswer: string, correctAnswer: string | undefined) {
    if (!correctAnswer) correctAnswer = "";

    // Remove content in parentheses from both strings
    const cleanUserAnswer = userAnswer.replace(/\s*\([^)]*\)/g, '').trim();
    const cleanCorrectAnswer = correctAnswer.replace(/\s*\([^)]*\)/g, '').trim();

    // Normalize both strings
    const u = normalizeWithNumbers(cleanUserAnswer);
    const c = normalizeWithNumbers(cleanCorrectAnswer);

    return similarityRatio(u, c) >= THRESHOLD;
}
