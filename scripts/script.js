// import
import OpenAI from "openai";
const aiKey = import.meta.env.VITE_AI

// initiate ai
const ai = new OpenAI({
  apiKey : aiKey,
  dangerouslyAllowBrowser : true
})

// response
const res = await ai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role:"user",
      content : "Give me a list of activity ideas based on my current location and weather"
    }
  ]
})
console.log(res)