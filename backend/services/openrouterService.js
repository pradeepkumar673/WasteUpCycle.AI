import axios from 'axios'

// Replace with your actual OpenRouter API key
const OPENROUTER_API_KEY = "your-actual-openrouter-key-here"
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Available models on OpenRouter (you can try different ones)
const MODELS = {
  'claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet', // Very good for creative tasks
  'gpt-4': 'openai/gpt-4',
  'gpt-3.5-turbo': 'openai/gpt-3.5-turbo', // Cheaper and fast
  'gemini-flash': 'google/gemini-flash-1.5-8b', 
  'llama-3.1': 'meta-llama/llama-3.1-8b-instruct'
}

export const analyzeWaste = async (material, category, quantity, unit) => {
  try {
    console.log('🔄 Calling OpenRouter API...')
    console.log('📤 Input:', { material, category, quantity, unit })
    
    const response = await axios.post(OPENROUTER_API_URL, {
      model: MODELS['claude-3.5-sonnet'], // Using Claude 3.5 Sonnet - excellent for creative tasks
      messages: [{
        role: "user",
        content: createPrompt(material, category, quantity, unit)
      }],
      temperature: 0.8,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
        'X-Title': 'WasteUpcycle AI' // Required by OpenRouter
      },
      timeout: 30000
    })

    console.log('✅ OpenRouter Response received!')
    const aiResponse = response.data.choices[0].message.content
    console.log('📄 Raw response preview:', aiResponse.substring(0, 200) + '...')
    
    const suggestions = parseAIResponse(aiResponse)
    console.log('🎯 Successfully parsed', suggestions.length, 'AI suggestions')
    
    // Show what we got
    suggestions.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion.productName} (${suggestion.difficulty})`)
    })
    
    return suggestions
    
  } catch (error) {
    console.error('❌ OpenRouter API failed:')
    console.error('Status:', error.response?.status)
    console.error('Error:', error.response?.data || error.message)
    
    throw new Error(`AI service error: ${error.response?.data?.error?.message || error.message}`)
  }
}

const createPrompt = (material, category, quantity, unit) => {
  return `
You are an expert upcycling specialist for the Indian market. Generate 3 creative and practical upcycling ideas for ${quantity} ${unit} of ${material} (category: ${category}).

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    {
      "id": "1",
      "productName": "Creative product name that specifically uses ${material}",
      "description": "2-3 sentence description explaining the product and its benefits for Indian consumers",
      "difficulty": "Beginner",
      "estimatedCost": 150,
      "sellingPriceRange": "₹200-500",
      "earningPotential": "₹50-350",
      "carbonSavings": 8.5,
      "marketDemand": 85,
      "roi": 150,
      "timeRequired": "2-3 hours",
      "materialsNeeded": ["${material} ${category}", "other material 1", "other material 2"],
      "toolsRequired": ["tool 1", "tool 2", "tool 3"],
      "steps": [
        "Step 1: Clear instruction specific to ${material}",
        "Step 2: Clear instruction specific to ${material}",
        "Step 3: Clear instruction specific to ${material}",
        "Step 4: Clear instruction specific to ${material}",
        "Step 5: Clear instruction specific to ${material}"
      ],
      "sellingPlatforms": ["Amazon India", "Flipkart", "Local Market"],
      "targetAudience": "Specific target customers who would buy ${material} products",
      "successRate": "85%",
      "customerRating": "4.5/5"
    }
  ]
}

IMPORTANT REQUIREMENTS:
- Make each idea UNIQUE and SPECIFIC to ${material} ${category}
- All prices in Indian Rupees (₹)
- Carbon savings: 2-15 kg CO2
- Market demand: 60-95%
- ROI: 80-300%
- Include popular Indian selling platforms
- Make steps practical and achievable for ${material}
- Consider Indian market preferences and availability

Generate 3 different ideas with varying difficulty levels (Beginner, Intermediate, Advanced).
`
}

const parseAIResponse = (response) => {
  try {
    console.log('🔍 Parsing AI response...')
    
    let cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim()
    const jsonStart = cleanResponse.indexOf('{')
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON structure found in response')
    }
    
    const jsonString = cleanResponse.substring(jsonStart, jsonEnd)
    console.log('📋 Extracted JSON string')
    
    const parsed = JSON.parse(jsonString)
    
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      throw new Error('Invalid response format - missing suggestions array')
    }
    
    console.log('✅ Successfully parsed JSON with', parsed.suggestions.length, 'suggestions')
    return parsed.suggestions
    
  } catch (error) {
    console.error('❌ Failed to parse AI response:', error.message)
    console.log('📄 Problematic response (first 500 chars):', response.substring(0, 500))
    throw new Error(`Failed to parse AI response: ${error.message}`)
  }
}

export const getCategories = async (material) => {
  try {
    console.log('🔄 Getting categories from OpenRouter for:', material)
    
    const prompt = `For the material "${material}", suggest 3-5 specific categories/types suitable for upcycling in India. Return ONLY JSON: {"categories": ["Category1", "Category2", "Category3"]}`

    const response = await axios.post(OPENROUTER_API_URL, {
      model: MODELS['gpt-3.5-turbo'], // Use cheaper model for categories
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.3,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'WasteUpcycle AI'
      }
    })

    const aiResponse = response.data.choices[0].message.content
    const cleanResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim()
    const jsonStart = cleanResponse.indexOf('{')
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1
    
    if (jsonStart !== -1 && jsonEnd !== 0) {
      const jsonString = cleanResponse.substring(jsonStart, jsonEnd)
      const parsed = JSON.parse(jsonString)
      return parsed.categories || getDefaultCategories(material)
    }
    
    return getDefaultCategories(material)
    
  } catch (error) {
    console.error('❌ OpenRouter categories error:', error.message)
    return getDefaultCategories(material)
  }
}

const getDefaultCategories = (material = '') => {
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
  } else if (materialLower.includes('electronic')) {
    return ['Phones', 'Computers', 'Wires', 'Batteries', 'Appliances']
  } else if (materialLower.includes('paper')) {
    return ['Newspaper', 'Cardboard', 'Books', 'Packaging', 'Office']
  } else if (materialLower.includes('organic')) {
    return ['Food Waste', 'Garden Waste', 'Agricultural', 'Compost', 'Mixed']
  } else {
    return ['Household', 'Industrial', 'Packaging', 'Construction', 'Mixed']
  }
}