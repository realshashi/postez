import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function rephraseContent(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a social media expert that rephrases content into engaging tweets. Keep the message concise and impactful while maintaining the original meaning. Format your response as JSON with a 'content' field containing the rephrased text.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 100,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.content;
  } catch (error) {
    console.error('Error rephrasing content:', error);
    throw new Error('Failed to rephrase content. Please try again later.');
  }
}