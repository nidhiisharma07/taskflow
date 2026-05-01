import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["Admin", "Member"],
      default: "Member"
    }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: {
      type: [memberSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

projectSchema.index({ title: 1, createdBy: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
