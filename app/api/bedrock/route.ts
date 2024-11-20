import { converseStreamWithModel } from "../../utils/bedrockService";
import { NextRequest, NextResponse } from "next/server";
import { ContentBlock, Message } from "@aws-sdk/client-bedrock-runtime";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageUrls = body.imageUrls as string[];
    const imageBytes = imageUrls.map(async (url, index) => {
      const response = await fetch(url, {
        mode: "no-cors",
        headers: {
          "Cache-Control": "no-cache",
          "User-Agent":
            "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        },
      });

      const imageArrayBuffer = await response.arrayBuffer();
      const imageBytes = new Uint8Array(imageArrayBuffer);
      return imageBytes;
    });

    const imageBytesList = await Promise.all(imageBytes);
    const content = [];
    for (let index = 0; index < imageBytesList.length; index++) {
      content.push({ text: `Image ${index + 1}` });
      content.push({
        image: {
          format: "jpeg",
          source: {
            bytes: imageBytesList[index],
          },
        },
      });
    }

    const bedrockRegion = "us-west-2";

    // const modelId = "anthropic.claude-3-haiku-20240307-v1:0";
    const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";

    const prompt = `
    Analyze the given images for traffic incidents or disruptions.

    Provide a detailed assessment of any observed issues, such as accidents, road closures, construction, or unusual congestion.
    Then, assign a severity score on a scale of 1 to 10, where 1 indicates minimal disruption and 10 represents severe impact on traffic flow. Consider factors like:

    - Type and scale of the incident
    - Number of vehicles or lanes affected
    - Potential for delays or danger to motorists
    - Visibility of the disruption
    - Presence of emergency services

    After your analysis, summarize your findings in this format:

    Severity Score: {1-10} \n
    Reasoning: {Explanation for the assigned score} \n

    If no traffic incidents or disruptions are visible in the image, state this clearly and assign a score of 1.
    Remember to base your analysis solely on what you can see in the provided image.
    `;
    content.push({ text: prompt });

    const message: Message = {
      role: "user",
      content: content as ContentBlock[],
    };

    const responseStream = await converseStreamWithModel(
      bedrockRegion,
      modelId,
      [message]
    );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream.stream!) {
            if (chunk.contentBlockDelta?.delta?.text) {
              const text = chunk.contentBlockDelta?.delta?.text;
              if (text) {
                const encoder = new TextEncoder();
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({
                      type: "chunk",
                      content: chunk.contentBlockDelta.delta.text,
                    }) + "\n"
                  )
                );
              }
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
