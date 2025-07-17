// import
import OpenAI from "openai";
const aiKey = import.meta.env.VITE_AI

// initiate ai
const ai = new OpenAI({
  apiKey : aiKey,
  dangerouslyAllowBrowser : true
})

// location
async function getLocation() {
  return new Promise((resolve, reject)=>{
    navigator.geolocation.getCurrentPosition(resolve,reject)
  })
}
const position = await getLocation()

// response
const res = await ai.chat.completions.create({
  model: "gpt-4.1-2025-04-14",
  messages: [
    {
      role:"user",
      content : `hi! whats this cordinates near to, the cords are ${position.coords.latitude}, ${position.coords.longitude}`
    }
  ]
})
console.log(res.choices[0].message.content)

