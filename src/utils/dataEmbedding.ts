import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import { Product } from "@prisma/client";
import { instantiateModel } from '../config/aiConfig';

config();

const model = instantiateModel('text-embedding-004');

function formatProductForEmbedding(product: Product): string {
  return `
    Product Name: ${product.name}
    Category: ${product.category}
    Description: ${product.description}
    Price: ${product.price}
    Packaging: ${product.packaging}
    sourcing: ${product.sourcing}
    Sustainability Tag: ${product.sustainabilityTag}
    ${product.onDemand ? 'onDemand: true' : `inStock: ${product.inStock}`}
  `.trim();
}

/**
 * Generates an embedding vector for a given product using the Gemini text-embedding-004 model.
 * 
 * @param {Product} product - The Product data model.
 * @returns {Promise<number[]>} A promise that resolves to the embedding vector (an array of numbers).
 * @throws Will propagate any errors from the Gemini API to be handled at a higher level.
 * 
 * Usage:
 * const embedding = await generateProductEmbedding(product);
 */
async function generateProductEmbedding(product: Product) {
    const formattedText = formatProductForEmbedding(product);
    const response = await model.embedContent({
      content: {
        role: 'user',
        parts: [{ text: formattedText }],
      },
    });
    return response.embedding.values;
}

export default generateProductEmbedding;
