/**
 * Computes the weighted sum of embeddings, normalizes the result, and returns a unit vector.
 * 
 * @param vectors - An array of objects containing `embedding` (number[]) and `weight` (number).
 * @returns number[] - A normalized vector representing the weighted average of the input embeddings.
 */
export default function getNormalizedWeightedSum(vectors: {embedding: number[], weight: number}[]): number[] {
    const weightedSumEmbedding: number[] = new Array(vectors[0].embedding.length).fill(0);
    let totalWeight: number = 0;
  
    // Calculate the weighted sum of embeddings
    for (const vector of vectors) {
        vector.embedding.forEach((value, index) => {
            weightedSumEmbedding[index] += value * vector.weight;  // Accumulate weighted values
        });
        totalWeight += vector.weight;
    }
  
    // Divide by total weight to get the weighted average
    weightedSumEmbedding.forEach((value, index, array) => {
        array[index] = value / totalWeight;
    });

    // L2 normalization (magnitude calculation)
    const magnitude = Math.sqrt(weightedSumEmbedding.reduce((sum, val) => sum + val * val, 0));

    // Return the normalized vector
    return weightedSumEmbedding.map(val => val / magnitude);
}