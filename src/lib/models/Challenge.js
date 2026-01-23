import mongoose from "mongoose";

const SolveSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const ChallengeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },

    category: { type: String, required: true },
    value: { type: Number, required: true },

    /* ---------- EXISTING STATIC FLAG ---------- */
    flag: {
      type: String,
      required: function () {
        return this.type !== "instance";
      },
    },

    /* ---------- NEW: challenge type ---------- */
    type: {
      type: String,
      enum: ["normal", "instance"],
      default: "normal",
      index: true,
    },

    /* ---------- NEW: instance config ---------- */
    instance: {
      image: String,        
      exposePort: Number,   
      timeout: Number,      
      buildStatus: {
        type: String,
        enum: ["pending", "building", "built", "failed"],
        default: "pending",
      },
      buildError: String,
    },

    file_url: { type: String },

    visible: { type: Boolean, default: true },

    solvedBy: {
      type: [SolveSchema],
      default: [],
    },
  },
  { timestamps: true }
);

ChallengeSchema.index(
  { _id: 1, "solvedBy.team": 1 },
  { unique: true, sparse: true }
);

export default mongoose.models.Challenge ||
  mongoose.model("Challenge", ChallengeSchema);
