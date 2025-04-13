import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";

// =======================================
// GET method to fetch videos from database
// =======================================
export async function GET() {
  try {
    // Connect to the MongoDB database
    await connectToDatabase();

    // Fetch all videos from the 'Video' collection, sorted by creation date (latest first)
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    // If no videos found, return an empty array with 200 status
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Return the list of videos as JSON
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error Fetching videos: ", error);

    // Handle error during fetch operation
    return NextResponse.json(
      { error: "Failed to fetch videos." },
      { status: 200 }
    );
  }
}

// =======================================
// POST method to upload a new video to ReelsPro
// Only allowed if user session exists
// =======================================
export async function POST(request: NextRequest) {
  try {
    // Get the session using next-auth
    const session = await getServerSession(authOptions);

    // If no session found, return 401 Unauthorized
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectToDatabase();

    // Get the request body (video details)
    const body: IVideo = await request.json();

    // Validate required fields
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Prepare video data with default values if not provided
    const videoData = {
      ...body,
      controls: body.controls ?? true, // Default controls to true if not provided
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100, // Default quality to 100 if not provided
      },
    };

    // Create and save the new video in the database
    const newVideo = await Video.create(videoData);

    // Return the created video as JSON response
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Error creating video: ", error);

    // Handle error during video creation
    return NextResponse.json(
      { error: "Failed to create a video." },
      { status: 200 }
    );
  }
}
