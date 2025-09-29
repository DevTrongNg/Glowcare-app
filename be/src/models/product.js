import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
    {
        // 1. THÔNG TIN CƠ BẢN VÀ MARKETING
        name: { // Tên sản phẩm
            type: String,
            required: true,
            trim: true, // Xóa khoảng trắng thừa ở đầu/cuối
            lowercase: true,
            index: true,
        },
        slug: { // Tên rút gọn (cho URL)
            type: String,
            unique: true,
            index: true,
        },
        description: String, // Mô tả chi tiết sản phẩm
        
        // 2. THÔNG TIN CHUYÊN BIỆT NGÀNH MỸ PHẨM
        brand: { // Thương hiệu sản phẩm
            type: String, 
            required: true,
            index: true
        },
        ingredients: { // Danh sách/Mô tả thành phần
            type: String, 
            trim: true,
        },
        howToUse: String, // Hướng dẫn sử dụng
        skinType: [String], // Loại da phù hợp (VD: "Da dầu", "Da nhạy cảm")
        countryOfOrigin: String, // Xuất xứ
        
        // 3. HÌNH ẢNH VÀ PHÂN LOẠI
        image: String, // URL ảnh đại diện
        gallery: [String], // Mảng các URL ảnh khác
        category: [
            { // Danh mục/Phân loại chính
                type: String,
                required: true,
            },
        ],
        tags: [String], // Thẻ sản phẩm
        
        // 4. GIÁ CẢ & TỒN KHO (TẠI CẤP SẢN PHẨM CHUNG)
        // Lưu ý: Giá & Tồn kho cụ thể nên ưu tiên dùng trong trường 'variations'
        basePrice: { // Giá niêm yết cơ bản (nếu không có biến thể)
            type: Number,
            required: true,
            default: 0,
        },
        discount: { // Giảm giá (Áp dụng cho toàn bộ sản phẩm)
            type: Number,
            default: 0,
        },
        totalCountInStock: { // Tổng số lượng sản phẩm trong kho (Tổng của tất cả biến thể)
            type: Number,
            default: 0,
        },
        
        // 5. BIẾN THỂ (VARIATIONS) - QUAN TRỌNG NHẤT CHO MỸ PHẨM (Màu sắc, Dung tích, v.v.)
        variations: [ 
            {
                // Ví dụ: key="Màu sắc", value="Đỏ Ruby" HOẶC key="Dung tích", value="50ml"
                key: { 
                    type: String,
                    required: true
                }, 
                value: { 
                    type: String,
                    required: true
                }, 
                sku: String, // Mã SKU riêng cho biến thể này (Đơn vị lưu kho)
                variantPrice: { // Giá riêng cho biến thể này (ưu tiên hơn basePrice)
                    type: Number,
                    default: 0
                },
                variantCountInStock: { // Tồn kho riêng cho biến thể này
                    type: Number,
                    default: 0
                },
                variantImage: String, // Ảnh riêng (ví dụ: swatch màu son)
            }
        ],

        // 6. THUỘC TÍNH MỞ RỘNG
        attributes: [ // Dùng để tham chiếu đến các Schema thuộc tính phức tạp hơn (VD: Bộ sưu tập, v.v.)
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Attribute",
            },
        ],
        
        // 7. TRẠNG THÁI
        featured: Boolean, // Sản phẩm nổi bật
    },
    { timestamps: true, versionKey: false }
);

// Plugin phân trang
productSchema.plugin(mongoosePaginate);

// Xuất Schema
export default mongoose.models.Product || mongoose.model("Product", productSchema);