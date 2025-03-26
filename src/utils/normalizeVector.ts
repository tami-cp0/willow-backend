/**
 * Computes the weighted sum of embeddings, normalizes the result, and returns a unit vector.
 * 
 * @param vectors - An array of objects containing `embedding` (number[]) and `weight` (number).
 * @returns number[] - A normalized vector representing the weighted average of the input embeddings.
 */
export default function getNormalizedWeightedSum(vectors: {embedding: number[], weight: number}[]): number[] {
    if (vectors.length === 0) throw new Error('No vectors provided');
    
    const embeddingLength = vectors[0].embedding.length;
    if (!vectors.every(v => v.embedding.length === embeddingLength)) {
        throw new Error('Inconsistent embedding dimensions');
    }

    const weightedSumEmbedding: number[] = new Array(embeddingLength).fill(0);
    let totalWeight: number = 0;

    for (const vector of vectors) {
        vector.embedding.forEach((value, index) => {
            weightedSumEmbedding[index] += value * vector.weight;
        });
        totalWeight += vector.weight;
    }

    const weightedAverage = weightedSumEmbedding.map(val => val / totalWeight);

    const magnitude = Math.sqrt(weightedAverage.reduce((sum, val) => sum + val * val, 0));

    return weightedAverage.map(val => val / magnitude);
}