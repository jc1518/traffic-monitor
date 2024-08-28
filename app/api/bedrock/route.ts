import { converseWithModel } from "../../utils/bedrockService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userMessage = await req.json(); // Get the body from the ReadableStream
  try {
    const responseText = await converseWithModel(userMessage);
    console.log(responseText);
    return NextResponse.json({ reply: responseText }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to invoke model" },
      { status: 500 }
    );
  }
}
