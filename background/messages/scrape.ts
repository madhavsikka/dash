import { env, pipeline, Pipeline } from "@xenova/transformers"
import { Embeddings } from "langchain/dist/embeddings/base"
import { Document } from "langchain/document"
import { MemoryVectorStore } from "langchain/vectorstores/memory"

import type { PlasmoMessaging } from "@plasmohq/messaging"

//@ts-ignore
env.allowLocalModels = false
env.backends.onnx.wasm.numThreads = 1

export class MiniLMEmbeddings extends Embeddings {
  private model
  constructor() {
    super({})
    this.initModel()
  }

  async initModel() {
    this.model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
  }

  async embedDocuments(texts) {
    if (!this.model) return []
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

// let store: MemoryVectorStore
// ;(async () => {
//   store = await MemoryVectorStore.fromTexts([], [], embeddings)
// })()

class VStore extends MemoryVectorStore {
  private store: MemoryVectorStore | undefined

  constructor(embeddings: Embeddings) {
    super(embeddings)
    this.init(embeddings)
  }

  async init(embeddings: Embeddings) {
    this.store = await MemoryVectorStore.fromTexts([], [], embeddings)
  }
}

const store = new VStore(embeddings)

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

  // const llmOut = await generateSequence(prompt, 0.7, 0.9, 300)
  // console.log(llmOut)

  res.send({
    message: "Got it in BGSW"
  })
}

export default handler
