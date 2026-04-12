import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String },
  category: { type: String },
  readTime: { type: String },
  featured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
