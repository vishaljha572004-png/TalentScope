import axios from "axios"

export const askAi = async (messages) => {
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty.")
        }

        // ✅ FIX: check API key exists before making request
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is missing in .env file")
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: messages
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173", // ✅ required by OpenRouter
                    "X-Title": "AI Interview App"            // ✅ recommended by OpenRouter
                }
            }
        )

        const result = response.data.choices[0].message.content
        return result

    } catch (error) {
        // ✅ FIX: log the actual error detail from OpenRouter
        console.log("AI error:", error.response?.data || error.message)
        return null
    }
}