import init, { Model } from "./m.js"

async function fetchArrayBuffer(url) {
  const cacheName = "phi-mixformer-candle-cache"
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(url)
  if (cachedResponse) {
    const data = await cachedResponse.arrayBuffer()
    return new Uint8Array(data)
  }
  const res = await fetch(url, { cache: "force-cache" })
  cache.put(url, res.clone())
  return new Uint8Array(await res.arrayBuffer())
}

class Phi {
  static instance = {}

  static async getInstance(weightsURL, modelID, tokenizerURL, quantized) {
    // load individual modelID only once
    if (!this.instance[modelID]) {
      await init()

      const [weightsArrayU8, tokenizerArrayU8] = await Promise.all([
        fetchArrayBuffer(weightsURL),
        fetchArrayBuffer(tokenizerURL)
      ])

      this.instance[modelID] = new Model(
        weightsArrayU8,
        tokenizerArrayU8,
        quantized
      )
    }
    return this.instance[modelID]
  }
}

async function generate(data) {
  const {
    weightsURL,
    modelID,
    tokenizerURL,
    quantized,
    prompt,
    temp,
    top_p,
    repeatPenalty,
    seed,
    maxSeqLen
  } = data
  const model = await Phi.getInstance(
    weightsURL,
    modelID,
    tokenizerURL,
    quantized
  )

  const firstToken = model.init_with_prompt(
    prompt,
    temp,
    top_p,
    repeatPenalty,
    64,
    BigInt(seed)
  )
  const seq_len = 2048

  let sentence = firstToken
  let maxTokens = maxSeqLen ? maxSeqLen : seq_len - prompt.length - 1
  let tokensCount = 0
  while (tokensCount < maxTokens) {
    const token = await model.next_token()
    console.log(token)
    if (token === "<|endoftext|>") {
      return
    }
    sentence += token
    tokensCount++
  }
  return sentence
}

export async function generateSequence(prompt, temperature, topP, maxSeqLen) {
  const modelID = "phi_1_5_quantized_2"
  const model = {
    base_url: "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-q80.gguf",
    quantized: true,
    seq_len: 2048
  }
  const TOKENIZER_URL =
    "https://huggingface.co/microsoft/phi-1_5/raw/main/tokenizer.json"
  const weightsURL = model.base_url + model.model

  return new Promise((resolve, reject) => {
    generate({
      weightsURL,
      modelID,
      tokenizerURL: TOKENIZER_URL,
      quantized: model.quantized,
      prompt,
      temp: temperature,
      top_p: topP,
      repeatPenalty: 1.0,
      seed: 10000,
      maxSeqLen,
      command: "start"
    })
      .then((res) => {
        console.log("LLM Res: ", res)
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
