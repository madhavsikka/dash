import type { PlasmoMessaging } from "@plasmohq/messaging"

import "subworkers"

import { generateSequence } from "../llm/customWorker"

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, Record<string, string>>,
  res
) => {
  const textContent = req.body.textContent
  // const shortTextContent = textContent.slice(0, 100)

  const shortTextContent = `The audio quality of the official video wasnt great due to an issue with the microphone, but I ran that audio through Adobes Enhance Speech tool and uploaded my own video with the enhanced audio to YouTube. Embeddings are a technology thats adjacent to the wider field of Large Language Models—the technology behind ChatGPT and Bard and Claude. Embeddings are based around one trick: take a piece of content—in this case a blog entry—and turn that piece of content into an array of floating point numbers.`

  const prompt = `
  Write a summary of the following text in 50 words: ${shortTextContent}
  Summary:
  `

  const llmOut = await generateSequence(prompt, 0.7, 0.9, 300)

  console.log(llmOut)

  res.send({
    message: "Got it in BGSW"
  })
}

export default handler
