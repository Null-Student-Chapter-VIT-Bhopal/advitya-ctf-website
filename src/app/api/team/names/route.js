import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Team from "@/lib/models/Team";

export async function GET() {
  try {
    await connectDB();

    const teams = await Team.find({}, { name: 1, _id: 0 }).lean();

    return NextResponse.json(
      {
        success: true,
        teams: teams.map((t) => t.name),
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("FETCH TEAM NAMES ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
