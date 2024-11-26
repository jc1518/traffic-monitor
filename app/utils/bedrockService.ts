import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand,
  Message,
} from "@aws-sdk/client-bedrock-runtime";

export async function converseStreamWithModel(
  region: string,
  modelId: string,
  messages: Message[]
) {
  const bedrockClient = new BedrockRuntimeClient({
    region: region,
  });
  const conversation: Message[] = messages;

  const command = new ConverseStreamCommand({
    modelId,
    messages: conversation,
    inferenceConfig: {
      maxTokens: 4096,
      temperature: 0.5,
      topP: 0.9,
    },
  });

  try {
    const response = await bedrockClient.send(command);
    return response;
  } catch (err) {
    console.error(`ERROR: Can't invoke '${modelId}'. Reason: ${err}`);
    throw new Error("Failed to invoke model");
  }
}

export async function converseWithModel(
  region: string,
  modelId: string,
  messages: Message[]
) {
  const bedrockClient = new BedrockRuntimeClient({
    region: region,
  });
  const conversation: Message[] = messages;

  const command = new ConverseCommand({
    modelId,
    messages: conversation,
    inferenceConfig: {
      maxTokens: 4096,
      temperature: 0.1,
      topP: 0.9,
    },
  });

  try {
    const response = await bedrockClient.send(command);
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
