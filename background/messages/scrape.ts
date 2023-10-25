import type { PlasmoMessaging } from "@plasmohq/messaging"

import "subworkers"

import { generateSequence } from "../llm/customWorker"

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, Record<string, string>>,
  res
) => {
  const textContent = req.body.textContent
  const shortTextContent = textContent.slice(0, 100)

  const prompt = `Please summarize the following text: ${shortTextContent}`

  const llmOut = await generateSequence(prompt, 0.7, 0.9, 50)

  console.log(llmOut)

  res.send({
    message: "Got it in BGSW"
  })
}

export default handler
