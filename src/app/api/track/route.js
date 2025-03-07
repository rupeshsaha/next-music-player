import Track from "@/models/Track.model";
import { dbConnect } from "@/utils/db";

export async function POST(req) {
  try {
    const { title, artist, thumbnailUrl, audioUrl } = await req.json();

    if (!title || !audioUrl) {
      return Response.json(
        { message: "Title and audio URL are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const createdTrack = await Track.create({
      title,
      artist,
      thumbnailUrl,
      audioUrl,
    });

    return Response.json(
      { success: true, track: createdTrack },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return Response.json(
      { success: false, message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const tracks = await Track.find({});

    if (!tracks.length) {
      return Response.json({ message: "No tracks found" }, { status: 404 });
    }

    return Response.json(
      { message: "All tracks fetched successfully", tracks },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while fetching tracks:", error);
    return Response.json(
      { message: "Error while fetching tracks", error: error.message },
      { status: 500 }
    );
  }
}
