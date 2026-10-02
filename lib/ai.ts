import { pipeline } from "@huggingface/transformers";

let embedder: any = null;

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }

    // Generate embedding tensor
    const output = await embedder(text, { pooling: "mean", normalize: true });

    // tolist() correctly extracts the nested JS array [[...384 numbers...]]
    const array = output.tolist();

    // Extract the inner 1D vector
    return Array.isArray(array[0]) ? array[0] : array;
}