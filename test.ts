import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { fromIni } from "@aws-sdk/credential-providers";

// Fetch AWS credentials from environment variables
// const credentials = fromIni({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

const client = new BedrockRuntimeClient({
  region: "us-west-2",
  credentials: fromIni(),
});

export async function invokeBedrock(
  modelId: string,
  prompt: string
): Promise<any> {
  const params = {
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt,
      max_tokens_to_sample: 500,
      temperature: 0.7,
      top_p: 1,
    }),
  };

  const command = new InvokeModelCommand(params);
  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));

  return result;
}

// Example usage
const test = async () => {
  const modelId = "anthropic.claude-v2";
  const prompt = "Hello, world!";
  const result = await invokeBedrock(modelId, prompt);
  console.log(result);
};
