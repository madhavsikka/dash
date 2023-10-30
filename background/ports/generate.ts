import type { PlasmoMessaging } from "@plasmohq/messaging"

import { generateSequence } from "~llm/customWorker"

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, Record<string, string>>,
  res: PlasmoMessaging.Response<Record<string, string>>
) => {
  const prompt = req.body.prompt
  console.log("prompt", prompt)
  generateSequence(prompt, 0.7, 0.9, 150, res)
}

export default handler
