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

// gpt-prompt
const systemPrompt = `You cycle through Thought, Action, PAUSE, Observation. At the end of the loop you output a final Answer. Your final answer should be highly specific to the observations you have from running the actions.

1. Thought: Describe your thoughts about the question you have been asked.
2. Action: run one of the actions available to you - then return PAUSE.
3. PAUSE
4. Observation: will be the result of running those actions.

Available actions:
- getLocation:
    E.g. getLocation: null  
    Returns user's location details. No arguments needed.

Example session:
Question: Please give me some ideas for activities to do this afternoon.  
Thought: I should look up the user's location so I can give location-specific activity ideas.  
Action: getLocation: null  
PAUSE

You will be called again with something like this:  
Observation: "New York City, NY"

Note :- If you dont know what user exactly wants, like next weather, weather before or something similar, go with general,  like todays weather!

Then you loop again:
Thought: Based on the user's location, I can now suggest some popular or interesting activities in that area this afternoon.  
Answer: <List of location-specific activity ideas that are highly relevant to the user’s location.>
`

// functions avaialble
const functions = {
  getLocation
}

// Function to perform ReAct
async function agent(query) {
  const messages = [
      {
        role : "system",
        content : systemPrompt
      },
      {
        role:"user",
        content : query
      }
  ]

  const maxAt = 5

  for(let i = 0; i<maxAt; i++){
      const res = await ai.chat.completions.create({
      model: "gpt-4.1-2025-04-14",
      messages: messages
    })
    console.log(res.choices[0].message.content)

    messages.push({
      role : "assistant",
      content : res.choices[0].message.content
    })
    console.log(res.choices[0].message.content)
    console.log("message pushed")

    // split the action string
    const string = res.choices[0].message.content
        .split("\n")
        .find(text => {
          return text.startsWith("Action:")
        })
    console.log("split done")

    if (string){
      // call for action
      console.log("action detcted")
      const divided = string.split("Action:")[1].trim()
      const [action, prop] = divided.split(":").map(s=>s.trim())
      console.log(action)
      const observation = await functions[action]()
      console.log("action performed")
      const {longitude, latitude} = observation.coords
      console.log(longitude, latitude)
      messages.push({
        role : "assistant",
        content : `observation: ${longitude}, ${latitude}`
      })
    } else {
      console.log("Agent finished with task")
      return res.choices[0].message.content
    }
  }
}

await agent("How is the weather in my city?")





















// response

// console.log(res.choices[0].message.content)

