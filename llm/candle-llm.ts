import { BaseLLM, type BaseLLMParams } from "langchain/dist/llms/base"
import type { LLMResult } from "langchain/dist/schema"

import { generateSequence } from "./customWorker"

export class CandleLLM extends BaseLLM {
  constructor(params: BaseLLMParams) {
    super(params)
  }

  async _generate(
    prompts: string[],
    options: this["ParsedCallOptions"]
  ): Promise<LLMResult> {
    console.log("CandleLLM._generate")
    const allPrompts = prompts.join("\n")
    const llmOut = await generateSequence(allPrompts, 0.7, 0.9, 50)
    const res: LLMResult = {
      generations: [[{ text: llmOut }]]
    }
    return Promise.resolve(res)
  }

  // Implement the required abstract method _llmType
  _llmType(): string {
    return "candle"
  }
}
