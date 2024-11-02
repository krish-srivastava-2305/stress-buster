import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

async function checkPostContent(content: string): Promise<boolean> {

  const apiKey = process.env.GOOGLE_API_KEY as string;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-002",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const prompt = `Evaluate the following post: "${content}". 

    **Consider the post's potential to be relevant to discussions about traumatic experiences and coping mechanisms.** 
    
    * Does the post describe emotional distress, psychological impact, or a struggle to manage difficult emotions? 
    * Does it mention experiences of abuse, bullying, violence, or loss (even without explicit details)?
    * Does it express a need for support, coping strategies, or a desire to heal from negative experiences? 
    
    **On the other hand,  consider if the content is:**
    
    * Explicitly promoting violence, self-harm, or suicide.
    * Spam or irrelevant to the platform's purpose.
    * Hate speech or discriminatory.
    
    **Evaluate the overall tone and context of the post.** Even if the content doesn't explicitly mention trauma, could it be related to a past negative experience or trigger emotional distress in someone else?
    
    **Based on this evaluation, reply with 1 if the content is suitable for a platform where people discuss traumatic experiences and coping mechanisms, and 0 if it is not.**
    `;

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text() as string;
    console.log("text:",responseText[0]);

    
    return responseText[0] === '1';
  } catch (error) {
    console.error("Error during API call:", error);
    return false;
  }
}

export default checkPostContent;
