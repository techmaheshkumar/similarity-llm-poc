import { pipeline, env } from '@xenova/transformers';

// Disable multithreading due to a bug in onnxruntime-web
env.backends.onnx.wasm.numThreads = 1;

class SimilarityFinder {
    static task = 'feature-extraction';
    // This model can be updated, based on our needs.
    // Available models.. ['thenlper/gte-small','thenlper/gte-base', 'thenlper/gte-large','BAAI/bge-small-en','BAAI/bge-base-en','BAAI/bge-large-en','BAAI/bge-large-en-v1.5', 'BAAI/bge-base-en-v1.5','BAAI/bge-small-en-v1.5','BAAI/bge-large-zh-v1.5','BAAI/bge-base-zh-v1.5', 'BAAI/bge-small-zh-v1.5',]
    static model = 'Xenova/bge-base-en-v1.5';
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model);
        }
        return this.instance;
    }
}

async function embed(text) {
    let embedder = await SimilarityFinder.getInstance();
    let embedding = await embedder(text, { pooling: 'mean', normalize: true });
    return embedding.data;
}

function cosineSimilarity(v1, v2) {
    if (v1.length !== v2.length) {
        throw new Error("Vectors must have the same length");
    }
    let dotProduct = 0;
    let v1_mag = 0;
    let v2_mag = 0;
    for (let i = 0; i < v1.length; i++) {
        dotProduct += v1[i] * v2[i];
        v1_mag += v1[i] ** 2;
        v2_mag += v2[i] ** 2;
    }
    return dotProduct / (Math.sqrt(v1_mag) * Math.sqrt(v2_mag));
}

async function calculateTextSimilarity(input1, input2) {
    return cosineSimilarity(await embed(input1), await embed(input2));
}

async function main() {
try {
        const text1 = "Hello, how are you?";
        const text2 = "Hi, How is doing?";
    
        console.log("Calculating similarity...");
        const similarity = await calculateTextSimilarity(text1, text2);
        console.log(`Similarity between "${text1}" and "${text2}": ${similarity}`);
     } catch (error) {
        console.error("An error occurred:", error);
    }
}

main().catch(console.error);
