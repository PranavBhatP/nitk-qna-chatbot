import { LLM, BaseLLMParams } from "langchain/llms/base"

export class OpenRouterLLM extends LLM {
  apiKey: string
  siteUrl: string
  siteName: string

  constructor(
    apiKey: string,
    siteUrl: string = "http://localhost:3000",
    siteName: string = "NITK-QA-Bot",
    params: BaseLLMParams = {}
  ) {
    super(params)
    this.apiKey = apiKey
    this.siteUrl = siteUrl
    this.siteName = siteName
  }

  async _call(prompt: string): Promise<string> {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.siteUrl,
          "X-Title": this.siteName,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            {
              "role": "user",
              "content": "You are answering questions about National Institute of Technology, Karnataka." + prompt
            }
          ]
        })
      })

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("OpenRouter API Error:", error)
      throw error
    }
  }

  _llmType() {
    return "openrouter"
  }
} 