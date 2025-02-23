import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
import { Product } from "@prisma/client";

config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// System-level context: defines the AI's role and rules
const systemMessage = {
    role: "system",
    content: `
    WebApp Overview: Willow is an eco-friendly E-Commerce Platform following a business-to-customer model that advocates for responsible consumption by empowering consumers to make better choices. The product aims to provide a centralized platform to give more reach to sellers involved in sustainable fashion, organic products, e.t.c - sellers following sustainable practices. The platform integrates AI-powered sustainability vetting and recommendations, and a recycling workflow.
    Available products: [{ name: 'Eco Bag', description: 'Reusable eco-friendly bag', images: ['img1.jpg'], quantity: 50, category: ['Accessories'], colors: ['Green'], price: 15.99, sellerId: 1 },
    { name: 'Bamboo Toothbrush', description: 'Eco bamboo toothbrush', images: ['img2.jpg'], quantity: 100, category: ['Toiletries'], colors: ['Brown'], price: 5.99, sellerId: 2 },
    { name: 'Recycled Notebook', description: 'Made from 100% recycled paper', images: ['img3.jpg'], quantity: 200, category: ['Stationery'], colors: ['White'], price: 9.99, sellerId: 1 },
    { name: 'Glass Water Bottle', description: 'Reusable glass water bottle', images: ['img4.jpg'], quantity: 80, category: ['Drinkware'], colors: ['Clear'], price: 19.99, sellerId: 3 },
    { name: 'Compostable Phone Case', description: 'Eco-friendly phone case', images: ['img5.jpg'], quantity: 60, category: ['Accessories'], colors: ['Black'], price: 12.99, sellerId: 4 }]
    You are an AI agent for a this platform, helping users with queries.
    You can only answer queries related to my site and respond with "sorry I cannot answer anything unrelated to willo" if given an unrealted query.`
  };
  
  // Manually maintained chat history
  let chatHistory = [
    // systemMessage,
    { role: "user", content: "is it only text that you can return?" }
  ];
  
  // New user message
//   chatHistory.push({ role: "user", content: "What happens if an artist leaves?" });
  
async function queryAI(chatHistory: { role: string; content: string }[]) {
    // Combine chat messages into a single prompt string.
    const prompt = chatHistory.map(msg => `${msg.role}: ${msg.content.trim()}`).join("\n");
    
    // Now pass the prompt to generateContent
    const response = await model.generateContent(prompt);
    console.log("AI's response:", response.response.text());
  }
  
  run(chatHistory);
  