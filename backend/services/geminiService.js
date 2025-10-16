import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCDxjg1_TwyTkJTgCXgK2PX64VhVvPZVNw"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`

// New function to get categories for any material
export const getCategories = async (material) => {
  try {
    console.log('🔄 Getting categories for:', material);
    
    const prompt = createCategoriesPrompt(material);
    
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 500,
      }
    });

    console.log('✅ Categories API Response received');
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    console.log('📄 Raw categories response:', aiResponse);
    
    const categories = parseCategoriesResponse(aiResponse);
    console.log('🎯 Parsed categories:', categories);
    
    return categories;
    
  } catch (error) {
    console.error('❌ Gemini API error for categories:', error.response?.data || error.message);
    console.log('🔄 Falling back to default categories...');
    return getDefaultCategories(material);
  }
}

const createCategoriesPrompt = (material) => {
  return `
IMPORTANT: You MUST return ONLY valid JSON. No other text or explanations.

You are a waste management and recycling expert. For the material "${material}", generate relevant categories/types that would help in upcycling analysis.

Return EXACTLY this JSON format:
{
  "categories": ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"]
}

GUIDELINES:
- Return 3-5 most relevant categories
- Categories should be specific to the material
- Consider common forms and types of this material in waste
- Focus on categories that are suitable for upcycling
- Use clear, descriptive names
- Examples: 
  For "plastic": ["Bottles", "Containers", "Bags", "Packaging", "Toys"]
  For "wood": ["Furniture", "Pallets", "Construction", "Packaging", "Natural"]
  For "electronic": ["Phones", "Computers", "Wires", "Batteries", "Appliances"]

Generate categories for: "${material}"
  `;
}

const parseCategoriesResponse = (response) => {
  try {
    console.log('🔍 Parsing categories response...');
    
    // Clean the response
    let cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Find JSON object
    const jsonStart = cleanResponse.indexOf('{');
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON found in categories response');
    }
    
    const jsonString = cleanResponse.substring(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.categories || !Array.isArray(parsed.categories)) {
      throw new Error('Invalid categories format in response');
    }
    
    return parsed.categories.slice(0, 5); // Limit to 5 categories
    
  } catch (error) {
    console.error('❌ Error parsing categories response:', error);
    console.log('🔄 Falling back to default categories...');
    return getDefaultCategories();
  }
}

const getDefaultCategories = (material = '') => {
  const materialLower = material.toLowerCase();
  
  // Smart fallback categories based on material type
  if (materialLower.includes('plastic')) {
    return ['Bottles', 'Containers', 'Bags', 'Packaging', 'Toys'];
  } else if (materialLower.includes('wood') || materialLower.includes('timber')) {
    return ['Furniture', 'Pallets', 'Construction', 'Packaging', 'Natural'];
  } else if (materialLower.includes('metal')) {
    return ['Cans', 'Foils', 'Wires', 'Utensils', 'Scrap'];
  } else if (materialLower.includes('glass')) {
    return ['Bottles', 'Jars', 'Windows', 'Containers', 'Broken'];
  } else if (materialLower.includes('textile') || materialLower.includes('cloth')) {
    return ['Cotton', 'Denim', 'Wool', 'Synthetic', 'Mixed'];
  } else if (materialLower.includes('electronic') || materialLower.includes('e-waste')) {
    return ['Phones', 'Computers', 'Wires', 'Batteries', 'Appliances'];
  } else if (materialLower.includes('paper') || materialLower.includes('cardboard')) {
    return ['Newspaper', 'Cardboard', 'Books', 'Packaging', 'Office'];
  } else if (materialLower.includes('organic') || materialLower.includes('food')) {
    return ['Food Waste', 'Garden Waste', 'Agricultural', 'Compost', 'Mixed'];
  } else {
    return ['Household', 'Industrial', 'Packaging', 'Construction', 'Mixed'];
  }
}

// Update the existing analyzeWaste function to handle dynamic materials
export const analyzeWaste = async (material, category, quantity, unit) => {
  try {
    console.log('🔄 Calling REAL Gemini API for:', material, category, quantity, unit);
    
    const prompt = createPrompt(material, category, quantity, unit);
    console.log('📤 Sending prompt to Gemini...');
    
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    console.log('✅ Gemini API Response received');
    const aiResponse = response.data.candidates[0].content.parts[0].text;
    console.log('📄 Raw AI Response:', aiResponse);
    
    const suggestions = parseAIResponse(aiResponse);
    console.log('🎯 Parsed suggestions:', suggestions.length);
    
    return suggestions;
    
  } catch (error) {
    console.error('❌ Gemini API error:', error.response?.data || error.message);
    console.log('🔄 Falling back to mock data...');
    return getMockSuggestions(material, category, quantity, unit);
  }
}

// Update the createPrompt function to be more generic
const createPrompt = (material, category, quantity, unit) => {
  return `
IMPORTANT: You MUST return ONLY valid JSON. No other text or explanations.

You are an expert upcycling specialist and environmental analyst for the Indian market. Generate 3 creative upcycling product ideas for ${quantity} ${unit} of ${material} (${category}).

Return EXACTLY this JSON format:
{
  "suggestions": [
    {
      "id": "1",
      "productName": "Creative and practical product name",
      "description": "2-3 sentence compelling description highlighting benefits and appeal",
      "difficulty": "Beginner",
      "estimatedCost": 150,
      "sellingPriceRange": "₹200-500",
      "earningPotential": "₹50-350",
      "carbonSavings": 8.5,
      "marketDemand": 85,
      "roi": 150,
      "timeRequired": "2-3 hours",
      "materialsNeeded": ["material1", "material2", "material3", "material4"],
      "toolsRequired": ["tool1", "tool2", "tool3"],
      "steps": ["Step 1: Clear instruction", "Step 2: Clear instruction", "Step 3: Clear instruction", "Step 4: Clear instruction", "Step 5: Clear instruction"],
      "sellingPlatforms": ["Amazon India", "Flipkart", "Local Markets"],
      "targetAudience": "Specific Indian customer segment",
      "successRate": "85%",
      "customerRating": "4.5/5"
    }
  ]
}

CRITICAL GUIDELINES:
- All prices in Indian Rupees (₹)
- Make products practical and achievable for Indian households
- Consider material availability in India
- Include popular Indian platforms: Amazon India, Flipkart, Meesho, OLX
- Carbon savings should be realistic (2-15 kg CO2)
- Market demand percentage (50-95%)
- ROI percentage (80-300%)
- Steps should be actionable and sequential
- Be creative with the material "${material}" and category "${category}"

Generate 3 diverse ideas with different difficulty levels (Beginner, Intermediate, Advanced).
  `;
}

const getMockSuggestions = (material, category, quantity, unit) => {
  console.log('🔄 Using mock data for:', material, category);
  const baseSuggestions = [
    {
      id: '1',
      productName: `${material.charAt(0).toUpperCase() + material.slice(1)} ${category} Planters`,
      description: `Create beautiful planters and garden decor using ${material} ${category}. Perfect for urban gardening and home decoration.`,
      difficulty: 'Beginner',
      estimatedCost: 150,
      sellingPriceRange: '₹200-500',
      earningPotential: '₹50-350',
      carbonSavings: 8.5,
      marketDemand: 85,
      roi: 150,
      timeRequired: '2-3 hours',
      materialsNeeded: [`${material} ${category}`, 'Soil', 'Seeds', 'Paint', 'Decorative items'],
      toolsRequired: ['Scissors', 'Brush', 'Drill', 'Measuring tape'],
      steps: [
        'Clean and prepare the materials thoroughly',
        'Create proper drainage holes if needed',
        'Decorate and customize the design with paint',
        'Add quality soil and compost mixture',
        'Plant seeds or small plants and water properly'
      ],
      sellingPlatforms: ['Amazon India', 'Flipkart', 'Local Nursery Markets'],
      targetAudience: 'Urban gardeners and home decor enthusiasts',
      successRate: '90%',
      customerRating: '4.5/5'
    },
    {
      id: '2',
      productName: `Creative ${material} Home Organizers`,
      description: `Transform ${material} ${category} into practical home organization solutions with stylish designs for modern Indian homes.`,
      difficulty: 'Intermediate',
      estimatedCost: 200,
      sellingPriceRange: '₹300-800',
      earningPotential: '₹100-600',
      carbonSavings: 6.2,
      marketDemand: 78,
      roi: 120,
      timeRequired: '3-4 hours',
      materialsNeeded: [`${material} ${category}`, 'Strong adhesive', 'Paint', 'Hardware', 'Decorative paper'],
      toolsRequired: ['Cutter', 'Sander', 'Paint brushes', 'Measuring tape'],
      steps: [
        'Design the organizer layout based on available space',
        'Cut and shape materials to required dimensions',
        'Assemble and securely join all pieces',
        'Apply finish with paint or decorative covering',
        'Add any functional hardware or decorative elements'
      ],
      sellingPlatforms: ['Amazon India', 'Flipkart', 'Facebook Marketplace'],
      targetAudience: 'Home organization enthusiasts and DIY lovers',
      successRate: '85%',
      customerRating: '4.3/5'
    },
    {
      id: '3',
      productName: `Upcycled ${material} Art Installation`,
      description: `Create unique artistic pieces and decorative installations from ${material} ${category} for contemporary home and office decor.`,
      difficulty: 'Advanced',
      estimatedCost: 300,
      sellingPriceRange: '₹500-1500',
      earningPotential: '₹200-1200',
      carbonSavings: 12.5,
      marketDemand: 65,
      roi: 180,
      timeRequired: '4-6 hours',
      materialsNeeded: [`${material} ${category}`, 'Art supplies', 'Frame materials', 'LED lights', 'Protective coating'],
      toolsRequired: ['Hot glue gun', 'Precision cutting tools', 'Electrical tools', 'Paint equipment'],
      steps: [
        'Plan the artistic design concept and layout',
        'Prepare and thoroughly clean all materials',
        'Assemble the main structural framework',
        'Add artistic elements, textures and details',
        'Apply final protective coating and finishing'
      ],
      sellingPlatforms: ['Etsy', 'Art galleries', 'Custom interior design orders'],
      targetAudience: 'Art collectors, interior designers, and premium home owners',
      successRate: '75%',
      customerRating: '4.7/5'
    }
  ]

  return baseSuggestions
}

const parseAIResponse = (response) => {
  try {
    console.log('🔍 Parsing AI response...');
    
    // Clean the response - remove markdown code blocks
    let cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Find JSON object
    const jsonStart = cleanResponse.indexOf('{');
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON found in response');
    }
    
    const jsonString = cleanResponse.substring(jsonStart, jsonEnd);
    console.log('📋 Extracted JSON string');
    
    const parsed = JSON.parse(jsonString);
    
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      throw new Error('Invalid suggestions format in response');
    }
    
    // Validate each suggestion has required fields
    const validatedSuggestions = parsed.suggestions.map((suggestion, index) => ({
      id: suggestion.id || `ai_${index + 1}`,
      productName: suggestion.productName || `AI Generated ${suggestion.difficulty || 'Beginner'} Product`,
      description: suggestion.description || 'AI-generated upcycling idea',
      difficulty: suggestion.difficulty || 'Beginner',
      estimatedCost: suggestion.estimatedCost || 150,
      sellingPriceRange: suggestion.sellingPriceRange || '₹200-500',
      earningPotential: suggestion.earningPotential || '₹50-350',
      carbonSavings: suggestion.carbonSavings || 8.5,
      marketDemand: suggestion.marketDemand || 75,
      roi: suggestion.roi || 120,
      timeRequired: suggestion.timeRequired || '2-3 hours',
      materialsNeeded: suggestion.materialsNeeded || ['Base materials', 'Additional supplies'],
      toolsRequired: suggestion.toolsRequired || ['Basic tools'],
      steps: suggestion.steps || ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
      sellingPlatforms: suggestion.sellingPlatforms || ['Online Platforms'],
      targetAudience: suggestion.targetAudience || 'General customers',
      successRate: suggestion.successRate || '80%',
      customerRating: suggestion.customerRating || '4.0/5'
    }));
    
    console.log('✅ Successfully parsed AI response');
    return validatedSuggestions;
    
  } catch (error) {
    console.error('❌ Error parsing AI response:', error);
    console.log('📄 Raw response that failed:', response);
    console.log('🔄 Falling back to mock data...');
    return getMockSuggestions();
  }
}