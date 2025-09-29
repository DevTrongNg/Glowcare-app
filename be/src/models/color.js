import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

colorSchema.plugin(mongoosePaginate);

export default mongoose.models.Color || mongoose.model("Color", colorSchema);
