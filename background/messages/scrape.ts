import { env, pipeline, Pipeline } from "@xenova/transformers"
import { Embeddings } from "langchain/dist/embeddings/base"
import { Document } from "langchain/document"
import { TextLoader } from "langchain/document_loaders/fs/text"
import { ParentDocumentRetriever } from "langchain/retrievers/parent_document"
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold"
import { InMemoryStore } from "langchain/storage/in_memory"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
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

  isReady() {
    return !!this.model
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

class VStore extends MemoryVectorStore {
  private store: MemoryVectorStore | undefined

  constructor(embeddings: MiniLMEmbeddings) {
    if (!embeddings.isReady) throw new Error("Embeddings not ready")
    super(embeddings)
    this.init(embeddings)
  }

  isReady() {
    return !!this.store
  }

  async init(embeddings: MiniLMEmbeddings) {
    this.store = await MemoryVectorStore.fromTexts([], [], embeddings)
  }
}

const vectorstore = new VStore(embeddings)
const docstore = new InMemoryStore()

const retriever = new ParentDocumentRetriever({
  vectorstore,
  docstore,
  // Optional, not required if you're already passing in split documents
  parentSplitter: new RecursiveCharacterTextSplitter({
    chunkOverlap: 0,
    chunkSize: 500
  }),
  childSplitter: new RecursiveCharacterTextSplitter({
    chunkOverlap: 0,
    chunkSize: 50
  }),
  // Optional `k` parameter to search for more child documents in VectorStore.
  // Note that this does not exactly correspond to the number of final (parent) documents
  // retrieved, as multiple child documents can point to the same parent.
  childK: 20,
  // Optional `k` parameter to limit number of final, parent documents returned from this
  // retriever and sent to LLM. This is an upper-bound, and the final count may be lower than this.
  parentK: 5
})

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, Record<string, string>>,
  res
) => {
  const pageTextContent = req.body.textContent
  const pageUrl = req.body.url

  if (!vectorstore.isReady()) {
    throw new Error("Store not ready")
  }

  console.log("Adding document to store")
  // await vectorstore.addDocuments([
  //   new Document({
  //     pageContent: pageTextContent,
  //     metadata: { id: pageUrl }
  //   })
  // ])
  await retriever.addDocuments([
    new Document({
      pageContent: pageTextContent,
      metadata: { id: pageUrl }
    })
  ])

  // const retriever = vectorstore.asRetriever({
  //   filter: (doc) => doc.metadata.id != pageUrl,
  //   k: 1
  // })

  const result = await retriever.getRelevantDocuments(pageTextContent)
  console.log(JSON.stringify(result, null, 1))

  // const resultsWithScore = await store.similaritySearchVectorWithScore(
  //   query,
  //   1,
  //   (doc) => doc.metadata.id != pageUrl
  // )
  // console.log(JSON.stringify(resultsWithScore, null, 1))

  // const llmOut = await generateSequence(prompt, 0.7, 0.9, 300)
  // console.log(llmOut)

  res.send({
    message: "Got it in BGSW"
  })
}

export default handler
