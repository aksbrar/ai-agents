// import
import OpenAI from "openai";
const aiKey = import.meta.env.VITE_AI

// initiate ai
const ai = new OpenAI({
  apiKey : aiKey,
  dangerouslyAllowBrowser : true
})
