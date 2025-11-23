import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHostCommentary = async (
  status: 'start' | 'shuffle' | 'win' | 'lose' | 'end',
  score: number = 0,
  round: number = 1
): Promise<string> => {
  const model = 'gemini-2.5-flash';

  let prompt = "";

  switch (status) {
    case 'start':
      prompt = "You are a cheerful game show host for a kids' game called 'Money Detectives' (ages 5-10). The money is hidden under rainbow cups. Give a very short, exciting 1-sentence welcome message.";
      break;
    case 'shuffle':
      prompt = "You are a cheerful game show host for 'Money Detectives'. Give a very short, energetic 1-sentence comment about shuffling the rainbow cups quickly.";
      break;
    case 'win':
      prompt = `You are a cheerful game show host for 'Money Detectives'. The kid just found the hidden money under the right cup! Round ${round}. Give a super enthusiastic, very short 1-sentence congratulation.`;
      break;
    case 'lose':
      prompt = `You are a cheerful game show host for 'Money Detectives'. The kid picked the wrong cup. Round ${round}. Give a kind, encouraging very short 1-sentence message like "Nice try!" or "So close!".`;
      break;
    case 'end':
      prompt = `You are a cheerful game show host for 'Money Detectives'. The game is over. The kid scored ${score} out of 5. Give a very short, encouraging 1-sentence closing remark tailored to that score.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Let's play!";
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback messages if API fails
    if (status === 'win') return "Yay! You found it!";
    if (status === 'lose') return "Oh no! Try again next time.";
    return "Welcome to Money Detectives!";
  }
};