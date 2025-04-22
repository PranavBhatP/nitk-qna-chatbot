"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterLLM = void 0;
const base_1 = require("langchain/llms/base");
class OpenRouterLLM extends base_1.LLM {
    constructor(apiKey, siteUrl = "http://localhost:3000", siteName = "NITK-QA-Bot", params = {}) {
        super(params);
        this.apiKey = apiKey;
        this.siteUrl = siteUrl;
        this.siteName = siteName;
    }
    async _call(prompt) {
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
            });
            const data = await response.json();
            return data.choices[0].message.content;
        }
        catch (error) {
            console.error("OpenRouter API Error:", error);
            throw error;
        }
    }
    _llmType() {
        return "openrouter";
    }
}
exports.OpenRouterLLM = OpenRouterLLM;
