const API_TOKENS = [
  "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",
  "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",
  "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",
  "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"
];

const FLUX_MODELS = [
  "black-forest-labs/FLUX.1-dev",
  "black-forest-labs/FLUX.1-schnell"
];

function getRandomToken(): string {
  return API_TOKENS[Math.floor(Math.random() * API_TOKENS.length)];
}

function getRandomModel(): string {
  return FLUX_MODELS[Math.floor(Math.random() * FLUX_MODELS.length)];
}

async function generateSingleDesign(prompt: string, index: number): Promise<string> {
  const retries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${getRandomModel()}`,
        {
          headers: {
            Authorization: `Bearer ${getRandomToken()}`,
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `Create a unique and creative t-shirt design based on this description: ${prompt}. Make it suitable for modern fashion trends.`,
            parameters: {
              width: 512,
              height: 512,
              seed: Math.floor(Math.random() * 2147483647) + index,
              guidance_scale: 7.5,
              num_inference_steps: 50
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate design (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated image is empty');
      }

      return URL.createObjectURL(blob);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      if (attempt === retries - 1) {
        throw lastError;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw lastError || new Error('Failed to generate design after multiple attempts');
}

export async function generateDesigns(prompt: string): Promise<string[]> {
  try {
    const results = await Promise.all(
      Array(4).fill(null).map((_, index) => generateSingleDesign(prompt, index))
    );

    return results;
  } catch (error) {
    console.error('Design generation error:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to generate designs: ${error.message}` 
        : 'Failed to generate designs. Please try again.'
    );
  }
}