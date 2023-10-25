import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const scrape = async () => {
  const textContent = document.body.innerText
  console.log(textContent)

  const resp = await sendToBackground({
    name: "scrape",
    body: {
      textContent
    }
  })
}

scrape()
