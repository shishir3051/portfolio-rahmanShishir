import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tag: { type: String },
  description: { type: String },
  projectYear: { type: String },
  role: { type: String },
  tech: [{ type: String }],
  details: [{ type: String }],
  liveUrl: { type: String },
  repoUrl: { type: String },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
