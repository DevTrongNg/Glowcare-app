    import mongoose from "mongoose"
    import mongoosePaginate from "mongoose-paginate-v2";


    const sizeChema = new mongoose.Schema(
        {
            name: { // Tên sản phẩm
                type: String,
                required: true,
                trim: true, // Xóa khoảng trắng thừa ở đầu/cuối
                lowercase: true,
                index: true,
            },
        }
    )

    sizeChema.pulin(mongoosePaginate);

    export default mongoose.models.Size || mongoose.model("Size", sizeChema);
                    