import axios from 'axios'

// Using Microsoft's DialoGPT model - free and no API key required for basic use
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large'

export const analyzeWaste = async (material, category, quantity, unit) => {
  try {
    console.log('🔄 Calling Hugging Face API...')
    console.log('📤 Input:', { material, category, quantity, unit })
    
    const prompt = createPrompt(material, category, quantity, unit)
    
    const response = await axios.post(HUGGINGFACE_API_URL, {
      inputs: prompt,
      parameters: {
        max_new_tokens: 800,
        temperature: 0.8,
        return_full_text: false
      }
    }, {
      timeout: 45000 // Hugging Face can be slow sometimes
    })

    console.log('✅ Hugging Face Response received!')
    
    if (response.data && response.data[0] && response.data[0].generated_text) {
      const aiResponse = response.data[0].generated_text
      console.log('📄 Raw AI response:', aiResponse)
      
      const suggestions = parseAIResponse(aiResponse, material, category)
      console.log('🎯 Parsed suggestions:', suggestions.length)
      
      return suggestions
    } else {
      throw new Error('Invalid response format from Hugging Face')
    }
    
  } catch (error) {
    console.error('❌ Hugging Face API failed:', error.message)
    console.log('🔄 Using enhanced mock data as fallback...')
    return getEnhancedMockSuggestions(material, category, quantity, unit)
  }
}

const createPrompt = (material, category, quantity, unit) => {
  return `
Create 3 upcycling product ideas for ${quantity} ${unit} of ${material} (${category}) for Indian market.

Return as JSON format:
{
  "suggestions": [
    {
      "id": "1",
      "productName": "Product name",
      "description": "Product description",
      "difficulty": "Beginner",
      "estimatedCost": 150,
      "sellingPriceRange": "₹200-500",
      "earningPotential": "₹50-350",
      "carbonSavings": 8.5,
      "marketDemand": 85,
      "roi": 150,
      "timeRequired": "2-3 hours",
      "materialsNeeded": ["${material}", "other material"],
      "toolsRequired": ["tool1", "tool2"],
      "steps": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
      "sellingPlatforms": ["Amazon India", "Flipkart"],
      "targetAudience": "Home users",
      "successRate": "85%",
      "customerRating": "4.5/5"
    }
  ]
}

Make each idea unique and practical for Indian households. All prices in Indian Rupees.
`
}

const parseAIResponse = (response, material, category) => {
  try {
    console.log('🔍 Parsing AI response...')
    
    // Try to extract JSON from the response
    let cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim()
    
    // Find JSON boundaries
    const jsonStart = cleanResponse.indexOf('{')
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1
    
    if (jsonStart !== -1 && jsonEnd !== 0) {
      const jsonString = cleanResponse.substring(jsonStart, jsonEnd)
      console.log('📋 Extracted JSON string')
      
      const parsed = JSON.parse(jsonString)
      
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        console.log('✅ Successfully parsed AI response')
        return parsed.suggestions
      }
    }
    
    throw new Error('No valid JSON found in response')
    
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error.message)
    console.log('🔄 Using enhanced mock data instead...')
    return getEnhancedMockSuggestions(material, category)
  }
}

const getEnhancedMockSuggestions = (material, category, quantity = 1, unit = 'kg') => {
  console.log('🎭 Using ENHANCED mock data for:', material, category, quantity, unit)
  
  const baseCost = Math.max(100, quantity * 20)
  const basePrice = Math.max(200, quantity * 50)
  
  return [
    {
      id: '1',
      productName: `Upcycled ${material} ${category} Planter`,
      description: `Transform ${material} ${category} into beautiful planters perfect for Indian homes. Great for small gardens and balcony gardening. Saves ${(quantity * 0.8).toFixed(1)} kg CO2.`,
      difficulty: 'Beginner',
      estimatedCost: baseCost,
      sellingPriceRange: `₹${basePrice}-${basePrice + 300}`,
      earningPotential: `₹${Math.round(basePrice * 0.3)}-${Math.round((basePrice + 300) * 0.7)}`,
      carbonSavings: Math.round(quantity * 0.8 * 10) / 10,
      marketDemand: 85,
      roi: 150,
      timeRequired: '2-3 hours',
      materialsNeeded: [
        `${material} ${category}`,
        'Potting soil',
        'Seeds or small plants',
        'Eco-friendly paint',
        'Decorative stones'
      ],
      toolsRequired: [
        'Scissors/Cutter',
        'Paint brushes',
        'Drill (for drainage)',
        'Measuring tape'
      ],
      steps: [
        `Clean and prepare the ${material} ${category}`,
        'Create drainage holes at the bottom',
        'Paint and decorate the exterior',
        'Add soil and plant your seeds',
        'Water lightly and place in sunlight'
      ],
      sellingPlatforms: ['Amazon India', 'Flipkart', 'Local Nursery'],
      targetAudience: 'Urban gardeners and plant lovers',
      successRate: '90%',
      customerRating: '4.5/5'
    },
    {
      id: '2',
      productName: `${material} ${category} Home Organizer`,
      description: `Create practical storage solutions from ${material} ${category}. Perfect for Indian households to organize kitchen, office, or bathroom items.`,
      difficulty: 'Intermediate',
      estimatedCost: baseCost + 50,
      sellingPriceRange: `₹${basePrice + 100}-${basePrice + 600}`,
      earningPotential: `₹${Math.round((basePrice + 100) * 0.4)}-${Math.round((basePrice + 600) * 0.6)}`,
      carbonSavings: Math.round(quantity * 0.6 * 10) / 10,
      marketDemand: 78,
      roi: 120,
      timeRequired: '3-4 hours',
      materialsNeeded: [
        `${material} ${category}`,
        'Strong adhesive',
        'Eco-friendly paint',
        'Decorative paper',
        'Small hardware'
      ],
      toolsRequired: [
        'Measuring tape',
        'Cutter/Scissors',
        'Paint brushes',
        'Sandpaper'
      ],
      steps: [
        `Measure and cut ${material} to required sizes`,
        'Sand edges for smooth finish',
        'Assemble pieces with strong adhesive',
        'Paint and decorate as desired',
        'Add any dividers or compartments'
      ],
      sellingPlatforms: ['Amazon India', 'Flipkart', 'Facebook Marketplace'],
      targetAudience: 'Home organization enthusiasts',
      successRate: '85%',
      customerRating: '4.3/5'
    },
    {
      id: '3',
      productName: `Creative ${material} Art Piece`,
      description: `Turn ${material} ${category} into unique wall art or decorative items. Adds character to any Indian home while being eco-friendly.`,
      difficulty: 'Advanced',
      estimatedCost: baseCost + 100,
      sellingPriceRange: `₹${basePrice + 200}-${basePrice + 1000}`,
      earningPotential: `₹${Math.round((basePrice + 200) * 0.5)}-${Math.round((basePrice + 1000) * 0.5)}`,
      carbonSavings: Math.round(quantity * 1.2 * 10) / 10,
      marketDemand: 65,
      roi: 180,
      timeRequired: '4-5 hours',
      materialsNeeded: [
        `${material} ${category}`,
        'Art supplies',
        'Frame materials',
        'LED lights (optional)',
        'Protective coating'
      ],
      toolsRequired: [
        'Hot glue gun',
        'Precision tools',
        'Paint equipment',
        'Safety gear'
      ],
      steps: [
        `Design your art concept using ${material}`,
        'Prepare and clean all materials thoroughly',
        'Assemble the main structure',
        'Add artistic details and colors',
        'Apply protective coating and finish'
      ],
      sellingPlatforms: ['Etsy', 'Local Art Markets', 'Custom Orders'],
      targetAudience: 'Art lovers and interior designers',
      successRate: '75%',
      customerRating: '4.7/5'
    }
  ]
}

export const getCategories = async (material) => {
  console.log('🔄 Getting categories for:', material)
  
  // Smart category detection based on material type
  const materialLower = material.toLowerCase()
  
  if (materialLower.includes('plastic')) {
    return ['Bottles', 'Containers', 'Bags', 'Packaging', 'Toys']
  } else if (materialLower.includes('wood')) {
    return ['Furniture', 'Pallets', 'Construction', 'Packaging', 'Natural']
  } else if (materialLower.includes('metal')) {
    return ['Cans', 'Foils', 'Wires', 'Utensils', 'Scrap']
  } else if (materialLower.includes('glass')) {
    return ['Bottles', 'Jars', 'Windows', 'Containers', 'Broken']
  } else if (materialLower.includes('textile') || materialLower.includes('cloth')) {
    return ['Cotton', 'Denim', 'Wool', 'Synthetic', 'Mixed']
  } else if (materialLower.includes('electronic') || materialLower.includes('e-waste')) {
    return ['Phones', 'Computers', 'Wires', 'Batteries', 'Appliances']
  } else if (materialLower.includes('paper') || materialLower.includes('cardboard')) {
    return ['Newspaper', 'Cardboard', 'Books', 'Packaging', 'Office']
  } else if (materialLower.includes('organic') || materialLower.includes('food')) {
    return ['Food Waste', 'Garden Waste', 'Agricultural', 'Compost', 'Mixed']
  } else {
    return ['Household', 'Industrial', 'Packaging', 'Construction', 'Mixed']
  }
}