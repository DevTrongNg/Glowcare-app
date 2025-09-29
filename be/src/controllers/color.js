import Color from '../models/color.model.js';
import { StatusCodes } from 'http-status-codes';

// --- 1. GET: Lấy tất cả Color có phân trang và tìm kiếm ---
export const getAllColors = async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword = '' } = req.query;

        const query = keyword
            ? { name: { $regex: keyword.toLowerCase(), $options: 'i' } }
            : {};

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { name: 1 },
            customLabels: {
                docs: 'colors',
                totalDocs: 'totalItems',
            },
        };

        const result = await Color.paginate(query, options);

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách màu sắc thành công.',
            ...result,
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi lấy danh sách màu sắc.',
            error: error.message,
        });
    }
};

// --- 2. GET: Lấy một Color theo ID ---
export const getColorById = async (req, res) => {
    try {
        const color = await Color.findById(req.params.id);

        if (!color) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Không tìm thấy màu sắc.',
            });
        }

        return res.status(StatusCodes.OK).json({
            message: 'Lấy màu sắc thành công.',
            color,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID màu sắc không hợp lệ.',
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi lấy màu sắc.',
            error: error.message,
        });
    }
};

// --- 3. POST: Tạo mới một Color ---
export const createColor = async (req, res) => {
    try {
        const { name } = req.body;

        const existingColor = await Color.findOne({ name: name.toLowerCase() });
        if (existingColor) {
            return res.status(StatusCodes.CONFLICT).json({
                message: 'Tên màu sắc đã tồn tại.',
            });
        }

        const newColor = await Color.create({ name });

        return res.status(StatusCodes.CREATED).json({
            message: 'Tạo màu sắc thành công.',
            color: newColor,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Dữ liệu không hợp lệ.',
                errors: error.errors,
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi tạo màu sắc.',
            error: error.message,
        });
    }
};

// --- 4. PUT/PATCH: Cập nhật một Color theo ID ---
export const updateColor = async (req, res) => {
    try {
        const { name } = req.body;
        const colorId = req.params.id;

        if (name) {
            const existingColor = await Color.findOne({ name: name.toLowerCase(), _id: { $ne: colorId } });
            if (existingColor) {
                return res.status(StatusCodes.CONFLICT).json({
                    message: 'Tên màu sắc đã tồn tại ở một ID khác.',
                });
            }
        }

        const updatedColor = await Color.findByIdAndUpdate(
            colorId,
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedColor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Không tìm thấy màu sắc để cập nhật.',
            });
        }

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật màu sắc thành công.',
            color: updatedColor,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID màu sắc không hợp lệ.',
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi cập nhật màu sắc.',
            error: error.message,
        });
    }
};

// --- 5. DELETE: Xóa một Color theo ID ---
export const deleteColor = async (req, res) => {
    try {
        const deletedColor = await Color.findByIdAndDelete(req.params.id);

        if (!deletedColor) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: 'Không tìm thấy màu sắc để xóa.',
            });
        }

        return res.status(StatusCodes.OK).json({
            message: 'Xóa màu sắc thành công.',
            color: deletedColor,
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'ID màu sắc không hợp lệ.',
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi server khi xóa màu sắc.',
            error: error.message,
        });
    }
};
