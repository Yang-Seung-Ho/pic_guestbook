// VoteModel.js
const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  entryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guestbook',  // Reference the Guestbook collection
    required: true
  },
  question: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model("Vote", voteSchema);
