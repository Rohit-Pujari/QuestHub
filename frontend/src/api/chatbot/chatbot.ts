import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_AI_API_URL!;

const chatbotAPI = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const chatAiAPI = async (prompt: string) => {
  try {
    const payload = {
      prompt: prompt,
      model: "llama3.2",
      stream: false,
    };
    const response = await chatbotAPI.post("/api/generate", payload);
    if (!response || !response.data) {
      throw new Error("Failed to get chatbot response");
    }
    return response.data;
  } catch (err) {
    throw new Error("Failed to get chatbot response");
  }
};

export { chatAiAPI };

export default chatbotAPI;
