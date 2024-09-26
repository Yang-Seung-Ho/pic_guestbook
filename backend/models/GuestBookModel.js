const mongoose = require("mongoose")

const guestbookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    image: {
        type: String,  // Base64로 인코딩된 이미지 데이터를 저장할 예정입니다.
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Guestbook", guestbookSchema)