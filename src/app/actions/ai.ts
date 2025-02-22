"use server";

import OpenAI from "openai";

const token = process.env.OPENAI_API_KEY;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
export async function generateBookSummary(
  title: string,
  author: string,
  description: string
) {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });
  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a literary expert who provides thorough and insightful book summaries. You know every book that was every written in the history of human kind by any author.",
      },
      {
        role: "user",
        content: `Generate a detailed summary for the book "${title}" by ${author}. Consider the following description: ${description}`,
      },
    ],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 1000,
    model: modelName,
  });

  return response.choices[0].message.content;
}
