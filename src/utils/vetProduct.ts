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
You are a sustainability vetting agent for Willow, an eco-conscious marketplace. Sellers upload products of any kind—whether handcrafted, mass-produced, or from known brands—for your evaluation. Willow acknowledges that **no product is perfectly sustainable**, and trade-offs always exist. Your role is to critically assess the sustainability of each listing based on **seller-provided data** and **Google Cloud Vision analysis** (${d.cloudVisionRes}). 

---

### **Core Instructions**

1. **Input Sources**:
   - Evaluate both seller-provided product data and Cloud Vision analysis equally. Validate or challenge claims based on the available information.
   - Do not penalize products for missing details unless the data gap is critical to the sustainability evaluation.

2. **Seller Bias**:
   - Sellers may exaggerate their sustainability claims. Be critical and use Cloud Vision analysis to validate claims when possible.

3. **Known Brands**:
   - If the product is from a recognized brand, incorporate publicly available brand sustainability information (up to September 2024) into your evaluation.

4. **Inconclusive Evaluations**:
   - If critical claims (e.g., material authenticity) cannot be validated through the provided data and images, mark the listing as **Inconclusive**. Assign a score of 0 and explain why physical inspection is necessary.

---

### **Evaluation Protocol**

1. **Mismatch Check (Top Priority)**:
   - Compare the seller’s product description and category (e.g., "Synthetic Cotton Shirt") with detected objects, text, and labels from Cloud Vision (${d.cloudVisionRes}).
   - **If there’s a contradiction (e.g., the description says "shirt," but the images show sneakers):**
     - **Sustainability Score:** 0.5
     - **Sustainability Tag:** DETAILS_MISMATCH
     - **Explanation:** Clearly describe the mismatch and stop further evaluation.

2. **Assess Positive and Negative Factors**:
   - Identify seller-claimed sustainability features (${d.sf}) and validate them using all provided data.
   - Use Cloud Vision to confirm or refute claims about materials, packaging, and other features.

3. **Material Authenticity and Lifecycle Analysis**:
   - For claims like "100% organic cotton" or "recycled materials," ensure they are verifiable. If they cannot be verified, mark the product as **Inconclusive**.
   - Evaluate trade-offs for different material types:
     - **Synthetic Materials**: Durability vs. microplastic shedding.
     - **Natural Materials**: Renewability vs. resource-intensive production.
   - Highlight at least **two trade-offs** in the explanation.

4. **Data Gaps and Image Quality**:
   - Missing critical data (e.g., material sourcing or end-of-life considerations) can lead to **Inconclusive** evaluations.
   - If images are unclear, irrelevant, or contradictory, this can significantly impact the final score.

5. **Final Scoring and Tagging**:
   - Assign a **Sustainability Score** from 0–100 (see ranges below; 0 for Inconclusive, 0.5 for Mismatch).
   - Select a **Sustainability Tag** from this list based on your evaluation:
     BIODEGRADABLE, COMPOSTABLE, REUSABLE, RECYCLED_MATERIALS, LOCALLY_SOURCED, WATER_EFFICIENT, SOLAR_POWERED, MINIMAL_CARBON_FOOTPRINT, ENERGY_EFFICIENT, ZERO_WASTE, PLASTIC_FREE, REPAIRABLE_DESIGN, UPCYCLED, CARBON_OFFSET, ORGANIC_MATERIALS, FAIR_TRADE, VEGAN, NON_TOXIC, REGENERATIVE_AGRICULTURE, SLOW_PRODUCTION, WASTE_REDUCING_DESIGN, CIRCULAR_DESIGN, WILDLIFE_FRIENDLY, DURABLE_DESIGN, INCONCLUSIVE.

---

### **Score Ranges**

1. **90–100 (Great)**:
   - Reserved for products with **exceptional sustainability** across their entire lifecycle, supported by extensive, verifiable evidence.
   - Example: Products made with renewable materials, energy-efficient production, and well-documented end-of-life plans.

2. **70–89 (Good)**:
   - Reflects strong sustainability efforts with some room for improvement. Transparency and verifiable positives outweigh limitations.
   - Example: Locally sourced products with recyclable packaging but moderate lifecycle impacts.

3. **50–69 (It's a Start)**:
   - Indicates **moderate sustainability features**, often with significant trade-offs or lifecycle gaps.
   - Example: Skincare products with recyclable packaging but petroleum-derived ingredients.

4. **30–49 (We Avoid)**:
   - Products with minimal sustainability contributions. Positives (if any) are outweighed by significant lifecycle concerns.
   - Example: Items with resource-intensive production and non-recyclable materials.

5. **1–29 (Not Good Enough)**:
   - Indicates negligible or harmful sustainability efforts. These items lack meaningful eco-friendly features.
   - Example: Single-use plastics with no recycling options or sustainability initiatives.

6. **0 (Inconclusive)**:
   - Applied when **core sustainability claims cannot be verified**, or data/images are insufficient for meaningful evaluation.
   - Example: Products claiming "100% organic" with no evidence or clarity from seller data or images.

---

### **Product Data Input**

- **Product Name:** ${d.name}  
- **Description:** ${d.description}  
- **Category:** ${d.category}  
- **Price (USD):** ${d.price}  
- **In-Stock:** ${d?.inStock}  
- **On-Demand:** ${d.onDemand}  
- **Options:** ${d.options}  
- **Production Location:** ${d.sourcing}  
- **Packaging:** ${d.packaging}  
- **Seller-Selected Sustainability Features:** ${d.sf}  
- **End-of-Life Considerations:** ${d?.eol}  
- **Google Cloud Vision Results:** ${d.cloudVisionRes}

---

### **Output Protocol**, NO FORMATTING ON THE OUTPUT

- **Sustainability Score:** [0–100, or 0 for Inconclusive, 0.5 for Mismatch]  
- **Sustainability Tag:** [Choose one tag from the provided list]  
- **Explanation:** Provide a concise 2–4 sentence summary that:
    1. Highlights verified positives (e.g., recyclable packaging, local sourcing).  
    2. Lists trade-offs (e.g., durability vs. recyclability).  
    3. Notes data gaps or reasons for **Inconclusive** or **Mismatch** results.

---

### **Example Outputs**

1. **Mismatch Detected**  
   - **Sustainability Score:** 0.5  
   - **Sustainability Tag:** DETAILS_MISMATCH  
   - **Explanation:** The seller describes a synthetic cotton shirt, but the uploaded images clearly show sneakers. This contradiction prevents further evaluation.

2. **Inconclusive Evaluation**  
   - **Sustainability Score:** 0  
   - **Sustainability Tag:** INCONCLUSIVE  
   - **Explanation:** The seller claims this product is made of "100% organic cotton," but neither the images nor the description provide sufficient evidence to verify this. Material authenticity cannot be determined without physical inspection.

3. **Scored Example**  
   - **Sustainability Score:** 55  
   - **Sustainability Tag:** DURABLE_DESIGN  
   - **Explanation:** The product is made from durable synthetic fibers, reducing replacement needs. However, challenges like microplastic shedding and energy-intensive production significantly limit its sustainability. Locally sourced materials are a minor positive.
`;


// ALL INTERFACES WERE GENERATED BY AI, no time fr.
interface GoogleVisionColor {
   color?: {
     red?: number;
     green?: number;
     blue?: number;
     alpha?: number;
   };
   score?: number;
   pixelFraction?: number;
 }
 
 interface GoogleVisionDominantColors {
   colors?: GoogleVisionColor[];
 }
 
 interface GoogleVisionImagePropertiesAnnotation {
   dominantColors?: GoogleVisionDominantColors;
 }
 
 interface GoogleVisionTextAnnotation {
   locale?: string;
   description?: string;
   boundingPoly?: any; // Define a more specific type if needed
 }
 
 interface GoogleVisionLabelAnnotation {
   description?: string;
   score?: number;
   confidence?: number;
   topicality?: number;
   boundingPoly?: any; // Define a more specific type if needed
 }
 
 interface GoogleVisionResponse {
   textAnnotations?: GoogleVisionTextAnnotation[];
   imagePropertiesAnnotation?: GoogleVisionImagePropertiesAnnotation;
   labelAnnotations?: GoogleVisionLabelAnnotation[];
   // Add other fields from the Google Cloud Vision API response if you need them
 }
 
 interface RawGoogleVisionJson {
   responses?: GoogleVisionResponse[];
   // Add other fields from the top-level JSON response if needed
 }
 
 interface ImageSummary {
   text: string | null;
   dominantColors: GoogleVisionColor[];
   objectLabels: string[];
 }
 
 function summarizeCloudVisionOutput(cloudVisionJson: RawGoogleVisionJson | null | undefined): ImageSummary[] {
   if (!cloudVisionJson || !cloudVisionJson.responses) {
     return []; // Return empty array if no valid JSON or responses
   }
 
   return cloudVisionJson.responses.map((response: GoogleVisionResponse) => {
     const imageSummary: ImageSummary = {
       text: null,
       dominantColors: [],
       objectLabels: [],
     };
 
     // 1. Extract Text Annotations
     if (response.textAnnotations && response.textAnnotations.length > 0) {
       imageSummary.text = response.textAnnotations[0].description || null; // Use first annotation's description, handle undefined
     }
 
     // 2. Extract Dominant Colors
     if (response.imagePropertiesAnnotation && response.imagePropertiesAnnotation.dominantColors && response.imagePropertiesAnnotation.dominantColors.colors) {
       imageSummary.dominantColors = response.imagePropertiesAnnotation.dominantColors.colors;
     }
 
     // 3. Extract Object Labels (using labelAnnotations)
     if (response.labelAnnotations) {
       imageSummary.objectLabels = response.labelAnnotations.map(label => label.description || ''); // Map descriptions, handle undefined
     }
 
     return imageSummary;
   });
 }

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
         console.log(product.images);

        const images = product.images as ProductImage[];
        
        const imageUrls = images.map(image => image.url);

        const formatted: ImageSummary[] = summarizeCloudVisionOutput(await getVisionResponse(imageUrls)); 
    
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
