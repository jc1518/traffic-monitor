import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
} from "@aws-sdk/client-bedrock-runtime";
import { fromIni } from "@aws-sdk/credential-providers";

const client = new BedrockRuntimeClient({
  region: "us-west-2",
  credentials: fromIni(),
});

export async function converseWithModel(userMessage: Message) {
  const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
  //const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";
  const conversation: Message[] = [userMessage];

  const command = new ConverseCommand({
    modelId,
    messages: conversation,
    inferenceConfig: {
      maxTokens: 512,
      temperature: 0.5,
      topP: 0.9,
    },
  });

  try {
    const response = await client.send(command);
    if (
      response.output &&
      response.output.message &&
      response.output.message.content &&
      response.output.message.content.length > 0
    ) {
      return response.output.message.content[0].text;
    }
    return "No response text";
  } catch (err) {
    console.error(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
    throw new Error("Failed to invoke model");
  }
}
