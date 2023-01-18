import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentsSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, required: true }
  },
  { timestamps: true }
);
export default model("Comment", commentsSchema);
