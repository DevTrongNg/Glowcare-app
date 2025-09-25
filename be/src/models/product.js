import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new mongoose.Schema(
    {
        name: { // tên sản phẩm
            type: String,
            required: true,
            lowercase: true,
            index: true,
        },
        slug: { // tên sản phẩm
            type: String,
            unique: true,
            index: true,
        },
        category: [
            {
                type: String,
                required: true,
            },
        ],
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        image: String,
        gallery: [String],
        description: String,
        discount: { // giảm giá 
            type: Number,
            default: 0,
        },
        countInStock: { // số lượng sản phẩm
            type: Number,
            default: 0,
        },
        featured: Boolean,  // sản phẩm nổi bật
        tags: [String], // thẻ sản phẩm
        attributes: [ // thuộc tính sản phẩm
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Attribute",
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);
export default mongoose.models.Product || mongoose.model("Product", productSchema);
