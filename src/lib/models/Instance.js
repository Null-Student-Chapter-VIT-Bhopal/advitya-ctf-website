import mongoose from "mongoose";

const InstanceSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      index: true,
      required: true,
    },

    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    containerId: String,
    port: Number,

    flag: String, // per-team flag
    accessToken: String, // unguessable URL token

    expiresAt: Date,

    status: {
      type: String,
      enum: ["running", "stopped", "expired"],
      default: "running",
    },
  },
  { timestamps: true },
);

InstanceSchema.index({ team: 1, challenge: 1, status: 1 });

export default mongoose.models.Instance ||
  mongoose.model("Instance", InstanceSchema);
