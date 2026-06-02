/**
 * AI Service
 * Handles communication with OpenAI API
 */

require('dotenv').config();
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is missing');
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log('API KEY EXISTS:', !!process.env.OPENAI_API_KEY);

/**
 * Build system prompt for educational AI
 */
const buildSystemPrompt = (categoryName, subCategoryName) => `
You are an educational AI tutor.

Category: ${categoryName}
Subcategory: ${subCategoryName}

Answer only questions related to this topic.

Provide:
- Clear explanations
- Simple language
- Practical examples when relevant
- Step-by-step explanations when needed

If the question is unrelated to the selected topic,
politely explain that it is outside the chosen category.
`;

/**
 * Generate AI response
 */
const generateAIResponse = async ({
  categoryName,
  subCategoryName,
  prompt,
}) => {
  try {
    const systemPrompt = buildSystemPrompt(
      categoryName,
      subCategoryName
    );

    const response = await client.responses.create({
      //model: 'gpt-4o-mini',
      model:'gpt-5.4-mini',
      input: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    if (!response.output_text) {
      const error = new Error('AI returned empty response');
      error.statusCode = 502;
      error.type = 'AI_EMPTY_RESPONSE';
      throw error;
    }

    return response.output_text;
  } catch (error) {
    console.error('OPENAI ERROR:', error);

    //  Invalid API Key
    if (error?.status === 401) {
      const err = new Error('Invalid OpenAI API key');
      err.statusCode = 401;
      err.type = 'AI_AUTH_ERROR';
      throw err;
    }

    //  Bad request / model issue
    if (error?.status === 400 || error?.status === 404) {
      const err = new Error('Invalid OpenAI request or model');
      err.statusCode = 400;
      err.type = 'AI_BAD_REQUEST';
      throw err;
    }

    //  No connection / network issue
    if (!error?.status) {
      const err = new Error('AI connection failed');
      err.statusCode = 503;
      err.type = 'AI_CONNECTION_ERROR';
      throw err;
    }

    //  Unknown error
    const err = new Error('AI service unavailable');
    err.statusCode = 503;
    err.type = 'AI_UNKNOWN_ERROR';
    throw err;
  }
};

module.exports = {
  generateAIResponse,
};