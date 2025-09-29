import Size from '../models/size.model.js'; // Đảm bảo đường dẫn đến mô hình Size là đúng
import { StatusCodes } from 'http-status-codes'; // (Tùy chọn) Thư viện giúp quản lý mã trạng thái HTTP

// --- 1. GET: Lấy tất cả Size có phân trang và tìm kiếm ---
export const getAllSizes = async (req, res) => {
    try {
        // Lấy query params: page, limit, keyword
        const { page = 1, limit = 10, keyword = '' } = req.query;

        // Tạo điều kiện tìm kiếm (Case-insensitive search by name)
        const query = keyword
            ? { name: { $regex: keyword.toLowerCase(), $options: 'i' } }
            : {};

        // Cấu hình options cho mongoose-paginate-v2
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { name: 1 }, // Sắp xếp theo tên tăng dần
            customLabels: {
                docs: 'sizes',
                totalDocs: 'totalItems',
            },
        };

        const result = await Size.paginate(query, options);

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách kích thước thành công.',
            ...result, // Trả về toàn bộ kết quả phân trang
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi lấy danh sách kích thước.',
            error: error.message,
        });
    }
};

// --- 2. GET: Lấy một Size theo ID ---
export const getSizeById = async (req, res) => {
    try {
        const size = await Size.findById(req.params.id);

        if (!size) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Không tìm thấy kích thước.',
            });
        }

        return res.status(StatusCodes.OK).json({
            message: 'Lấy kích thước thành công.',
            size,
        });
    } catch (error) {
        // Kiểm tra lỗi ID không hợp lệ (ví dụ: ID không đúng định dạng ObjectId)
        if (error.kind === 'ObjectId') {
             return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID kích thước không hợp lệ.',
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi lấy kích thước.',
            error: error.message,
        });
    }
};

// --- 3. POST: Tạo mới một Size ---
export const createSize = async (req, res) => {
    try {
        const { name } = req.body;

        // Kiểm tra xem tên kích thước đã tồn tại chưa
        const existingSize = await Size.findOne({ name: name.toLowerCase() });
        if (existingSize) {
            return res.status(StatusCodes.CONFLICT).json({
                message: 'Tên kích thước đã tồn tại.',
            });
        }

        const newSize = await Size.create({ name });

        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo kích thước thành công.',
            size: newSize,
        });
    } catch (error) {
        // Kiểm tra lỗi validation của Mongoose (ví dụ: trường required bị thiếu)
        if (error.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Dữ liệu không hợp lệ.',
                errors: error.errors,
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi tạo kích thước.',
            error: error.message,
        });
    }
};

// --- 4. PUT/PATCH: Cập nhật một Size theo ID ---
export const updateSize = async (req, res) => {
    try {
        const { name } = req.body;
        const sizeId = req.params.id;

        // Tùy chọn: Kiểm tra trùng lặp tên với các ID khác
        if (name) {
            const existingSize = await Size.findOne({ name: name.toLowerCase(), _id: { $ne: sizeId } });
            if (existingSize) {
                return res.status(StatusCodes.CONFLICT).json({
                    message: 'Tên kích thước đã tồn tại trong một ID khác.',
                });
            }
        }

        const updatedSize = await Size.findByIdAndUpdate(
            sizeId,
            { name }, // Chỉ cập nhật trường name
            { new: true, runValidators: true } // Trả về đối tượng đã cập nhật, chạy validators
        );

        if (!updatedSize) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Không tìm thấy kích thước để cập nhật.',
            });
        }

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật kích thước thành công.',
            size: updatedSize,
        });
    } catch (error) {
         if (error.kind === 'ObjectId') {
             return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID kích thước không hợp lệ.',
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi cập nhật kích thước.',
            error: error.message,
        });
    }
};

// --- 5. DELETE: Xóa một Size theo ID ---
export const deleteSize = async (req, res) => {
    try {
        const deletedSize = await Size.findByIdAndDelete(req.params.id);

        if (!deletedSize) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Không tìm thấy kích thước để xóa.',
            });
        }

        return res.status(StatusCodes.OK).json({
            message: 'Xóa kích thước thành công.',
            size: deletedSize,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
             return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID kích thước không hợp lệ.',
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi xóa kích thước.',
            error: error.message,
        });
    }
};