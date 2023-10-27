import { env, pipeline, Pipeline } from "@xenova/transformers"
import { Embeddings } from "langchain/dist/embeddings/base"
import { Document } from "langchain/document"
import { MemoryVectorStore } from "langchain/vectorstores/memory"

// import { VoyVectorStore } from "langchain/vectorstores/voy"
// import { Voy as VoyClient } from "voy-search"

// import { generateSequence } from "../llm/customWorker"
import type { PlasmoMessaging } from "@plasmohq/messaging"

import "subworkers"

//@ts-ignore
env.allowLocalModels = false
env.backends.onnx.wasm.numThreads = 1

export class MiniLMEmbeddings extends Embeddings {
  private model
  constructor() {
    super({})
  }

  async initModel() {
    this.model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
  }

  async embedDocuments(texts) {
    if (!this.model) {
      await this.initModel()
    }
    const embeddings = []
    for (const text of texts) {
      const embedding = await this.embedQuery(text)
      embeddings.push(embedding)
    }
    return embeddings
  }

  async embedQuery(text) {
    return this.model(text)
  }
}

const embeddings = new MiniLMEmbeddings()
// const voyClient = new VoyClient()
// const store = new VoyVectorStore(voyClient, embeddings)

let store: MemoryVectorStore
;(async () => {
  store = await MemoryVectorStore.fromTexts([], [], embeddings)
})()

// let extractor: Pipeline
// ;(async () => {
//   extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
// })()

// async function extract(extractor: Pipeline, text: string) {
//   const result = await extractor(text, { pooling: "mean", normalize: true })
//   return result.data
// }

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, Record<string, string>>,
  res
) => {
  const textContent = req.body.textContent

  if (!store) {
    console.log("Store not ready")
    res.send({
      message: "Store not ready"
    })
    return
  }

  console.log("Adding document to store")
  await store.addDocuments([
    new Document({
      pageContent: textContent
    })
  ])

  const query = await embeddings.embedQuery("Evilness")
  const resultsWithScore = await store.similaritySearchVectorWithScore(query, 1)
  console.log(JSON.stringify(resultsWithScore, null, 2))

  // if (!extractor) {
  //   console.log("Extractor not ready")
  //   res.send({
  //     message: "Extractor not ready"
  //   })
  //   return
  // }

  // const emb = await extract(extractor, textContent)
  // const llmOut = await generateSequence(prompt, 0.7, 0.9, 300)
  // console.log(llmOut)

  res.send({
    message: "Got it in BGSW"
  })
}

export default handler
