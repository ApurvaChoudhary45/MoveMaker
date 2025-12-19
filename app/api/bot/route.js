import OpenAI from "openai";


export async function POST(req) {
    const body = await req.json()
    const {message} = body

    try {
        const client = new OpenAI({
        apiKey : process.env.API_KEY
    })

    const greetings = ["hi", "hello", "hey", "yo", "hola"]
    if(greetings.includes(message.toLowerCase().trim())){
        return Response.json({
             reply: "Hey! I'm your MoveMaker coach. How can I help you with your workouts today?"
        })
    }

    const fitnessKeywords = ["workout", "exercise", "gym", "training", "muscle", "fat", "diet", "pushups"];

    const isfitnessquery = fitnessKeywords.some(k=>message.toLowerCase().includes(k))

    if(!isfitnessquery){
        return Response.json({
            reply: "I can only help with workouts, fitness, muscle building, fat loss, and training advice. Ask me something related to exercise!"
        })
    }
    const workoutIntentWords = ["create", "build", "make", "give", "suggest", "plan", "routine"];

    const wantsworkout = workoutIntentWords.some(k=>message.toLowerCase().includes(k)) && fitnessKeywords.some(k=>message.toLowerCase().includes(k))

    let aiPrompt = ''

    if(wantsworkout){
        aiPrompt = `
      Generate a simple, beginner-friendly workout routine based on this request:
      "${message}"

      Format it in clean bullet points. Keep it easy to read.
      `;
    }
    else{
        aiPrompt = `
      The user has asked a fitness-related question:
      "${message}"

      Give a short, helpful, 3-4 sentence explanation.
      Do NOT generate a full workout routine.
      `;
    }

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages : [
            {role : 'system', content: "You are MoveMaker AI, a friendly workout assistant."},
            {role : 'user', content : aiPrompt}
        ],

    })

     const reply = completion.choices[0].message.content;

     return Response.json({reply})
    } catch (error) {
        console.error("MoveMaker Error:", error);
    return Response.json(
      { reply: "Something went wrong. Try again." },
      { status: 500 }
    );
    }

    


}