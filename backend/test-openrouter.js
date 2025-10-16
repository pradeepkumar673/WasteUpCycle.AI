import axios from 'axios'

// Replace with your ACTUAL OpenRouter key
const OPENROUTER_API_KEY = "your-actual-openrouter-key-here"
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

async function testOpenRouter() {
  try {
    console.log('🧪 Testing OpenRouter API...')
    
    const response = await axios.post(OPENROUTER_API_URL, {
      model: "anthropic/claude-3.5-sonnet",
      messages: [{
        role: "user",
        content: "Say hello in JSON format: {\"message\": \"hello\"}"
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'WasteUpcycle AI'
      },
      timeout: 15000
    })

    console.log('✅ OpenRouter is WORKING!')
    console.log('Response:', response.data.choices[0].message.content)
    console.log('🎯 You can now use real AI!')
    
  } catch (error) {
    console.error('❌ OpenRouter failed:')
    console.error('Status:', error.response?.status)
    console.error('Error:', error.response?.data?.error || error.message)
  }
}

testOpenRouter()