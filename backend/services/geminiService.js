import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`

export const analyzeWaste = async (material, category, quantity, unit) => {
  try {
    // For demo purposes, return mock data
    // Replace this with actual Gemini API call in production
    return getMockSuggestions(material, category, quantity, unit)
    
    /* Uncomment for actual Gemini API integration:
    const prompt = createPrompt(material, category, quantity, unit)
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })

    const aiResponse = response.data.candidates[0].content.parts[0].text
    return parseAIResponse(aiResponse)
    */
  } catch (error) {
    console.error('Gemini API error:', error)
    return getMockSuggestions(material, category, quantity, unit)
  }
}

const createPrompt = (material, category, quantity, unit) => {
  return `
    Generate 3 creative upcycling ideas for ${quantity} ${unit} of ${material} (${category}) for Indian market.
    Return JSON format with product suggestions including name, description, difficulty, estimated cost in INR,
    selling price range, earning potential, carbon savings, market demand %, ROI %, time required, materials needed,
    tools required, step-by-step instructions, selling platforms, target audience, success rate, and customer rating.
  `
}

const getMockSuggestions = (material, category, quantity, unit) => {
  const baseSuggestions = [
    {
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
      materialsNeeded: [`${material} ${category}`, 'Soil', 'Seeds', 'Paint'],
      toolsRequired: ['Scissors', 'Brush', 'Drill'],
      steps: [
        'Clean and prepare the materials thoroughly',
        'Create proper drainage if needed',
        'Decorate and customize the design',
        'Add soil and planting medium',
        'Plant seeds or small plants'
      ],
      sellingPlatforms: ['Amazon', 'Flipkart', 'Local Markets'],
      targetAudience: 'Urban gardeners and home decor enthusiasts',
      successRate: '90%',
      customerRating: '4.5/5'
    },
    {
      productName: `Creative ${material} Home Organizers`,
      description: `Transform ${material} ${category} into practical home organization solutions with stylish designs.`,
      difficulty: 'Intermediate',
      estimatedCost: 200,
      sellingPriceRange: '₹300-800',
      earningPotential: '₹100-600',
      carbonSavings: 6.2,
      marketDemand: 78,
      roi: 120,
      timeRequired: '3-4 hours',
      materialsNeeded: [`${material} ${category}`, 'Glue', 'Paint', 'Hardware'],
      toolsRequired: ['Cutter', 'Sander', 'Paint brushes'],
      steps: [
        'Design the organizer layout',
        'Cut and shape materials as needed',
        'Assemble and secure all pieces',
        'Finish with paint or sealant',
        'Add any decorative elements'
      ],
      sellingPlatforms: ['Etsy', 'Amazon', 'Facebook Marketplace'],
      targetAudience: 'Home organization enthusiasts',
      successRate: '85%',
      customerRating: '4.3/5'
    },
    {
      productName: `Upcycled ${material} Art Pieces`,
      description: `Create unique art and decorative pieces from ${material} ${category} for modern home decor.`,
      difficulty: 'Advanced',
      estimatedCost: 300,
      sellingPriceRange: '₹500-1500',
      earningPotential: '₹200-1200',
      carbonSavings: 12.5,
      marketDemand: 65,
      roi: 180,
      timeRequired: '4-6 hours',
      materialsNeeded: [`${material} ${category}`, 'Art supplies', 'Frame', 'Lights'],
      toolsRequired: ['Hot glue gun', 'Cutting tools', 'Electrical tools'],
      steps: [
        'Plan the artistic design and layout',
        'Prepare and clean all materials',
        'Assemble the main structure',
        'Add artistic elements and details',
        'Finish with protective coating'
      ],
      sellingPlatforms: ['Etsy', 'Art galleries', 'Custom orders'],
      targetAudience: 'Art collectors and interior designers',
      successRate: '75%',
      customerRating: '4.7/5'
    }
  ]

  return baseSuggestions
}

const parseAIResponse = (response) => {
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]).suggestions
    }
    throw new Error('Invalid JSON response')
  } catch (error) {
    console.error('Error parsing AI response:', error)
    return getMockSuggestions()
  }
}