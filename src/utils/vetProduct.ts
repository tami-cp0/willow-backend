import { Product } from "@prisma/client";
import { getVisionResponse, instantiateModel } from "../config/aiConfig";

const sustainabilityPrompt = (d: {
    cloudVisionRes: string;
    sourcing: string;
    name: string;
    description: string;
    category: string;
    sf: string[];
    packaging: string;
    price: number;
    onDemand: boolean;
    eol: string | null;
    options: any;
    inStock: number | null;
    certification?: any;
  }) => `
You are a sustainability agent with extensive experience in evaluating products based on their environmental performance using comprehensive data. Your task is to assess the sustainability of a product using both the explicit seller-provided data and the analysis from Google Cloud Vision (which includes object, label, text detection, and image properties). Note that sellers may either sell their own creations or products from other companies, and the information provided is subject to seller bias—sellers might list sustainability features that do not accurately reflect the product. Additionally, some products (for example, wigs or other items where material authenticity can only be determined in person) cannot be reliably vetted using only images and provided data; in such cases, your evaluation should output "Inconclusive" as your explanation and 0 as the sustainability score. If a known brand is recognized and there is available data on its sustainability practices as of September 2024, include that in your assessment.

Note: Details regarding the manufacturing process will not be provided (due to trade secret reasons), so you should not penalize the product’s sustainability score solely for the absence of this information.

The product data is provided dynamically as follows:

Product Name: ${d.name}
Description: ${d.description}
Category: ${d.category}
Price: ${d.price}
In-Stock (optional): ${d?.inStock}
On-Demand Flag: ${d.onDemand}
Available Options (e.g., size, color) (optional): ${d.options}
Material (optional): ${d?.options.material}
Production & Packaging Information:

Production Location: ${d.sourcing}
Note: This indicates whether the product is locally produced or imported.
Packaging Type: ${d.packaging}
Sustainability Data:

Sustainability Features (seller-selected from the following list):
BIODEGRADABLE, COMPOSTABLE, REUSABLE, RECYCLED_MATERIALS, LOCALLY_SOURCED, WATER_EFFICIENT, SOLAR_POWERED, MINIMAL_CARBON_FOOTPRINT, ENERGY_EFFICIENT, ZERO_WASTE, PLASTIC_FREE, REPAIRABLE_DESIGN, UPCYCLED, CARBON_OFFSET, ORGANIC_MATERIALS, FAIR_TRADE, VEGAN, NON_TOXIC, REGENERATIVE_AGRICULTURE, SLOW_PRODUCTION, WASTE_REDUCING_DESIGN, CIRCULAR_DESIGN, WILDLIFE_FRIENDLY
Note: Although the seller selects these features, you must independently evaluate the product and choose a recommended sustainability tag solely based on your evaluation from the same list.
Additional Environmental Insights:

End-of-Life Considerations (disposal or recycling instructions): ${d?.eol}

Image(s) Analysis Data:
Google Cloud Vision Results (object, label, text detection, and image properties): ${d.cloudVisionRes}
Note: If the responses from multiple images do not indicate that they depict the same product/item in any significant way, then output "Image 1 is completely different from Image 2" as your explanation and 0 as the sustainability score.
In your evaluation, consider all aspects of the provided data while acknowledging that seller data is limited to these input fields and may reflect bias. Use the Google Cloud Vision results to validate or challenge the seller’s sustainability claims. Compare the explicit information (such as material, production practices, and packaging) with the indirect clues from the image analysis. If the provided images and data do not offer sufficient insight—especially for products that require in-person evaluation (e.g., to determine if a wig is synthetic or real)—then conclude that the evaluation is "Inconclusive" with a sustainability score of 0. Otherwise, weigh trade-offs (for example, lower emissions versus higher resource inputs) and, if applicable, include any known brand sustainability practices based on your data up to September 2024.

Your final output must strictly follow this format:

Sustainability Score: [0-100]
Sustainability Tag: [Your recommended tag from the provided list]
Explanation: [Your 2–4 sentence summary]

If the product appears to require in-person evaluation (i.e., the images and provided data require physical-real sustainability assessment), then your output should be:

Sustainability Score: 0
Sustainability Tag: Inconclusive
Explanation: Inconclusive
`;

type ProductImage = {
    url: string;
    key: string;
    size: number;
    mimetype: string;
    originalname: string;
};

const model = instantiateModel("gemini-1.5-flash");

async function vetProduct(product: Product) {
    try {
        const images = product.images as ProductImage[];
        
        const imageUrls = [images[0].url, images[1].url];
          
        const res = await getVisionResponse(imageUrls);
          
        const formatted = res.responses.map((response: any) => ({
            labelAnnotations: response.labelAnnotations,
            textAnnotations: response.textAnnotations?.[0]?.description || null,
            imagePropertiesAnnotation: response.imagePropertiesAnnotation,
        }));  
    
        const result = (
          await model.generateContent([
            sustainabilityPrompt({
              category: product.category,
              cloudVisionRes: JSON.stringify(formatted),
              description: product.description,
              sourcing: product.sourcing,
              name: product.name,
              onDemand: product.onDemand,
              packaging: product.packaging,
              price: product.price,
              sf: product.sustainabilityFeatures,
              eol: product.endOfLifeInfo,
              inStock: product.inStock,
              options: product.options,
              certification: product.certification
            }),
          ])
        ).response.text();
    
        return result;
      } catch (error) {
        console.log('vet product: ', error);
        throw error;
      }
}

export default vetProduct;
