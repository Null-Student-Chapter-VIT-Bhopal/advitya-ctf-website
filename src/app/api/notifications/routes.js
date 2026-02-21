import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import { connectDB } from "@/lib/db"; // your DB connection
import {
  broadcastGlobal,
  broadcastToTeam,
  broadcastToUser,
} from "@/lib/socket";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" && decoded.role !== "sudo") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const notification = await Notification.create({
      type: body.type,
      message: body.message,
      level: body.level,
      scope: body.scope,
      targetUser: body.targetUser || null,
      targetTeam: body.targetTeam || null,
      sentBy: decoded.userId,
    });

    const payload = {
      scope: notification.scope,
      type: "ADMIN_NOTIFICATION",
      message: notification.message,
      level: notification.level,
      notificationId: notification._id,
    };

    if (notification.scope === "global") {
      broadcastGlobal(payload);
    }

    if (notification.scope === "team") {
      broadcastToTeam(notification.targetTeam, payload);
    }

    if (notification.scope === "user") {
      broadcastToUser(notification.targetUser, payload);
    }

    return NextResponse.json(notification);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
