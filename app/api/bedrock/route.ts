import { converseWithModel } from "../../utils/bedrockService";
import { NextRequest, NextResponse } from "next/server";
import { ContentBlock, Message } from "@aws-sdk/client-bedrock-runtime";
import { prompt } from "./prompt";

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
    // const modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0";
    const modelId = "anthropic.claude-3-5-sonnet-20241022-v2:0";

    content.push({ text: prompt });

    const message: Message = {
      role: "user",
      content: content as ContentBlock[],
    };

    const response = await converseWithModel(bedrockRegion, modelId, [message]);

    return NextResponse.json(
      { reply: JSON.stringify(response) },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to invoke model" },
      { status: 500 }
    );
  }

  //   // streaming
  //   const responseStream = await converseWithModel(bedrockRegion, modelId, [
  //     message,
  //   ]);

  //   const stream = new ReadableStream({
  //     async start(controller) {
  //       try {
  //         for await (const chunk of responseStream.stream!) {
  //           if (chunk.contentBlockDelta?.delta?.text) {
  //             const text = chunk.contentBlockDelta?.delta?.text;
  //             if (text) {
  //               const encoder = new TextEncoder();
  //               controller.enqueue(
  //                 encoder.encode(
  //                   JSON.stringify({
  //                     type: "chunk",
  //                     content: chunk.contentBlockDelta.delta.text,
  //                   }) + "\n"
  //                 )
  //               );
  //             }
  //           }
  //         }
  //         controller.close();
  //       } catch (error) {
  //         controller.error(error);
  //       }
  //     },
  //   });

  //   return new NextResponse(stream);
  // } catch (error) {
  //   console.error("Error processing request:", error);
  //   return NextResponse.json(
  //     { error: "Failed to process request" },
  //     { status: 500 }
  //   );
  // }
}
