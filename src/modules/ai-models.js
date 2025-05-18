// 模型配置
export const AI_MODELS = {
  deepseek: {
    name: 'DeepSeek Chat',
    defaultUrl: 'https://api.deepseek.com/chat/completions',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    requestFormat: {
      model: 'deepseek-chat',
      temperature: 0.6,
      max_tokens: 2000,
      top_p: 0.8,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    }
  },  
  chatgpt: {
    name: 'GPT-4o',
    defaultUrl: 'https://api.openai.com/v1/chat/completions',
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }),
    requestFormat: {
      model: 'gpt-4o',
      temperature: 0.6,
      max_tokens: 2000,
      top_p: 0.8,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    }
  },
  claude: {
    name: 'Claude 3.7 Sonnet',
    defaultUrl: 'https://api.anthropic.com/v1/messages',
    headers: (apiKey) => ({
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    }),
    requestFormat: {
      model: 'claude-3.7-sonnet-20250224',
      temperature: 0.6,
      max_tokens: 2000
    }
  }
};