import mongoose from "mongoose";
const blacklistedTokenSchema = new mongoose.Schema({
    token: { // mã thông báo bị đen
        type: String,
        required: true,
    },
    expiryDate: { // ngày hết hạn
        type: Date,
        required: true,
    },
});

export default mongoose.model.BlacklistedToken ||
    mongoose.model("BlacklistedToken", blacklistedTokenSchema);
