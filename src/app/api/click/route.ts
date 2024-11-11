import connectDB from "@/libs/connect";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("click");

  const { searchParams } = new URL(req.url);
  const encodedUrl: string | null = searchParams.get("uri");

  // Check if the URL is missing
  if (!encodedUrl) {
    return NextResponse.json({ error: "Error getting URL" }, { status: 400 });
  }
  const decodedUrl = atob(encodedUrl);

  try {
    await connectDB();
    await Event.create({ type: "click", uri: decodedUrl });
    return NextResponse.json(true);
  } catch (error) {
    console.error("Error logging click event:", error);
    return NextResponse.json({ error: "Failed to log click" }, { status: 500 });
  }
}
