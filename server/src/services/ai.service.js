/**
 * AI Service
 * Handles communication with the Gemini API.
 */

require('dotenv').config();

const DEFAULT_MODEL = 'gemini-3.8-flash';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

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

const unavailableError = (message, type) => {
  const error = new Error(message);
  error.statusCode = 503;
  error.type = type;
  return error;
};

const readText = (body) => {
  const parts = body?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim();
};

/**
 * Generate an AI response.
 * The Gemini request is made only for this call, so a missing API key
 * does not prevent the rest of the server from starting.
 */
const generateAIResponse = async ({
  categoryName,
  subCategoryName,
  prompt,
}) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw unavailableError('AI service is not configured', 'AI_NOT_CONFIGURED');
  }

  const model = process.env.GEMINI_MODEL?.trim()
    || process.env.OPENAI_MODEL?.trim()
    || DEFAULT_MODEL;
  const systemPrompt = buildSystemPrompt(categoryName, subCategoryName);

  let response;
  try {
    response = await fetch(
      `${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );
  } catch (error) {
    console.error('GEMINI ERROR:', error.message);
    throw unavailableError('AI connection failed', 'AI_CONNECTION_ERROR');
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    console.error('GEMINI ERROR:', response.status, body?.error?.message);

    if (response.status === 401 || response.status === 403) {
      const err = new Error('Invalid Gemini API key');
      err.statusCode = 401;
      err.type = 'AI_AUTH_ERROR';
      throw err;
    }

    if (response.status === 400 || response.status === 404) {
      const err = new Error('Invalid Gemini request or model');
      err.statusCode = 400;
      err.type = 'AI_BAD_REQUEST';
      throw err;
    }

    throw unavailableError('AI service unavailable', 'AI_UNKNOWN_ERROR');
  }

  const text = readText(body);
  if (!text) {
    const error = new Error('AI returned empty response');
    error.statusCode = 502;
    error.type = 'AI_EMPTY_RESPONSE';
    throw error;
  }

  return text;
};

module.exports = {
  generateAIResponse,
};
