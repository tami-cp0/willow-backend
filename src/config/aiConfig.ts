import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { ErrorHandler } from "../utils/errorHandler";

config();

const visionApiKey = process.env.GOOGLE_VISION_API_KEY!;
const geminiApiKey = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(geminiApiKey);

type validModels = "gemini-1.5-flash" | 'text-embedding-004';
function instantiateModel(model: validModels) {
    return genAI.getGenerativeModel({ model });
}

async function getVisionResponse(imageUrls: string[]) {
  const requests = imageUrls.map((url) => ({
    image: {
      source: {
        imageUri: url,
      },
    },
    features: [
      { type: "LABEL_DETECTION" },
      { type: "IMAGE_PROPERTIES" },
      { type: "TEXT_DETECTION" },
    ],
  }));

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google Vision API error: ${response.status} - ${errorText}`);
    throw new ErrorHandler(500, 'Internal server error - vision');
  }

  return await response.json();
}

export { instantiateModel, getVisionResponse};