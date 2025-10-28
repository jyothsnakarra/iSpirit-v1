import { GoogleGenAI, Content, Type } from '@google/genai';
import { ChatMessage, MessageAuthor, RiddleState, Song } from '../types';

const getAi = () => {
    if (!process.env.API_KEY) {
        throw new Error("API Key not configured.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const getSystemInstruction = (personality: string) => {
  return `You are a friendly and empathetic AI companion. Your current personality is set to: ${personality}. 
Your goal is to provide a supportive and engaging conversation. 
Keep your responses concise, friendly, and natural. 
You can also suggest playing a game or listening to music if the conversation stalls.`;
};

export const getChatResponse = async (
  newMessage: string,
  history: ChatMessage[],
  personality: string
): Promise<string> => {
  try {
    const ai = getAi();
    
    // Remove initial bot greeting from history sent to Gemini for a cleaner context
    const contents: Content[] = history.slice(1).map(msg => ({ 
      role: msg.author === MessageAuthor.USER ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    contents.push({
      role: 'user',
      parts: [{ text: newMessage }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: getSystemInstruction(personality),
      },
    });

    return response.text.trim();

  } catch (error) {
    console.error('Error getting chat response from Gemini:', error);
    return "I'm sorry, I'm having a little trouble thinking right now. Could you try again in a moment?";
  }
};

export const getMusicSuggestions = async (genre: string): Promise<Song[]> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggest 5 songs for someone who likes ${genre} music.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        songs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    artist: { type: Type.STRING },
                                },
                                required: ['title', 'artist'],
                            },
                        },
                    },
                    required: ['songs'],
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.songs || [];
    } catch (error) {
        console.error('Error getting music suggestions:', error);
        return [];
    }
};

export const getNewRiddle = async (): Promise<RiddleState> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Tell me a new, original, and clever riddle that is not too easy or too hard, along with its answer.',
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        riddle: { type: Type.STRING },
                        answer: { type: Type.STRING },
                    },
                    required: ['riddle', 'answer'],
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse;
    } catch (error) {
        console.error('Error getting new riddle:', error);
        return {
            riddle: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
            answer: "A map",
        };
    }
};

export const getMindFeudQuestion = async (): Promise<{ question: string; answers: { answer: string; points: number }[] }> => {
    try {
        const ai = getAi();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Create a "Family Feud" style question with 5 popular answers and their point values (out of 100 total points for all answers). The question should be fun and general knowledge. For example: "Name something people often lose."',
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        answers: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    answer: { type: Type.STRING },
                                    points: { type: Type.INTEGER },
                                },
                                required: ['answer', 'points'],
                            },
                        },
                    },
                    required: ['question', 'answers'],
                },
            },
        });
        const jsonResponse = JSON.parse(response.text);
        // Ensure we only have 5 answers
        jsonResponse.answers = jsonResponse.answers.slice(0, 5);
        return jsonResponse;
    } catch (error) {
        console.error('Error getting Mind Feud question:', error);
        return {
            question: "Name a popular pizza topping.",
            answers: [
                { answer: "Pepperoni", points: 35 },
                { answer: "Mushrooms", points: 20 },
                { answer: "Onions", points: 15 },
                { answer: "Sausage", points: 12 },
                { answer: "Bacon", points: 8 },
            ],
        };
    }
};

export const getDebateTopicAndResponse = async (
    history?: { user: string; model: string }[]
): Promise<{ topic: string; response: string }> => {
    try {
        const ai = getAi();
        let prompt;
        if (history && history.length > 0) {
            const lastUserArgument = history[history.length - 1].user;
            prompt = `Continue the debate. The user's last argument was: "${lastUserArgument}". Provide a concise, clever, one-sentence counter-argument.`;
        } else {
            prompt = `Generate a lighthearted but interesting debate topic. Then, provide a one-sentence opening statement for one side of the argument. Example: "Topic: Is a hot dog a sandwich? Response: A hot dog is clearly not a sandwich as it is served in a bun, not between two slices of bread."`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING },
                        response: { type: Type.STRING },
                    },
                    required: ['topic', 'response'],
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse;

    } catch (error) {
        console.error('Error getting debate content:', error);
        return {
            topic: "Is pineapple a valid pizza topping?",
            response: "Absolutely, the sweetness of pineapple perfectly complements the savory flavors of ham and cheese."
        };
    }
};