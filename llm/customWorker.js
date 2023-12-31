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

  static async getInstance(
    weightsURL,
    modelID,
    tokenizerURL,
    configURL,
    quantized
  ) {
    // load individual modelID only once
    if (!this.instance[modelID]) {
      await init()

      const [weightsArrayU8, tokenizerArrayU8, configArrayU8] =
        await Promise.all([
          fetchArrayBuffer(weightsURL),
          fetchArrayBuffer(tokenizerURL),
          fetchArrayBuffer(configURL)
        ])

      this.instance[modelID] = new Model(
        weightsArrayU8,
        tokenizerArrayU8,
        configArrayU8,
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
    configURL,
    quantized,
    prompt,
    temp,
    top_p,
    repeatPenalty,
    seed,
    maxSeqLen,
    command,
    plasmoRes
  } = data
  const model = await Phi.getInstance(
    weightsURL,
    modelID,
    tokenizerURL,
    configURL,
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

  const postProcessSentence = (sentence) => {
    return sentence.replace(/<\|endoftext\|>/g, "").trim()
  }

  let sentence = firstToken
  let maxTokens = maxSeqLen ? maxSeqLen : seq_len - prompt.length - 1
  let tokensCount = 0
  while (tokensCount < maxTokens) {
    const token = await model.next_token()
    console.log(token)
    if (token === "<|endoftext|>") {
      plasmoRes.send({
        message: postProcessSentence(sentence),
        isRunning: false
      })
      return sentence
    }
    sentence += token
    plasmoRes.send({
      message: postProcessSentence(sentence),
      isRunning: true
    })
    tokensCount++
  }
  plasmoRes.send({
    message: postProcessSentence(sentence),
    isRunning: false
  })
  return sentence
}

export async function generateSequence(
  prompt,
  temperature,
  topP,
  maxSeqLen,
  plasmoRes
) {
  const modelID = "model-puffin-phi-v2-q4k.gguf"
  const model = {
    base_url: "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
    model: "model-puffin-phi-v2-q4k.gguf",
    tokenizer: "tokenizer-puffin-phi-v2.json",
    config: "puffin-phi-v2.json",
    quantized: true,
    seq_len: 2048,
    size: "1.50 GB"
  }
  // const modelID = "model-phi-hermes-1_3B-q4k.gguf"
  // const model = {
  //   base_url: "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/",
  //   model: "model-phi-hermes-1_3B-q4k.gguf",
  //   tokenizer: "tokenizer-puffin-phi-v2.json",
  //   config: "puffin-phi-v2.json",
  //   quantized: true,
  //   seq_len: 2048,
  //   size: "1.50 GB"
  // }
  const tokenizerURL = model.base_url + model.tokenizer
  const configURL = model.base_url + model.config
  const weightsURL = model.base_url + model.model

  return new Promise((resolve, reject) => {
    generate({
      weightsURL,
      modelID,
      tokenizerURL: tokenizerURL,
      configURL: configURL,
      quantized: model.quantized,
      prompt,
      temp: temperature,
      top_p: topP,
      repeatPenalty: 1.0,
      seed: 10000,
      maxSeqLen,
      command: "start",
      plasmoRes
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
