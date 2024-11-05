import { HfInference } from '@huggingface/inference';

const HF_TOKEN = "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";

export async function analyzeImage(imageFile: File): Promise<string> {
  try {
    const client = new HfInference(HF_TOKEN);
    
    // Convert File to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(imageFile);
    });

    const stream = await client.chatCompletionStream({
      model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this t-shirt design and describe its style, elements, and potential improvements in detail. Focus on the design elements, color scheme, typography, and overall aesthetic appeal."
            },
            {
              type: "image_url",
              image_url: {
                url: base64
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    let result = '';
    for await (const chunk of stream) {
      if (chunk.choices?.[0]?.delta?.content) {
        result += chunk.choices[0].delta.content;
      }
    }

    if (!result) {
      throw new Error('No analysis generated');
    }

    return result;
  } catch (error) {
    console.error('Image analysis error:', error);
    throw new Error('Failed to analyze image. Please try again.');
  }
}