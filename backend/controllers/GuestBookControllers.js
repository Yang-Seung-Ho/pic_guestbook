const GuestbookModel = require("../models/GuestbookModel")
const VoteModel = require("../models/VoteModel");

module.exports.getEntries = async (req, res) => {
    const entries = await GuestbookModel.find().sort({ createdAt: -1 })
    res.send(entries)
}   

module.exports.getEntriesWithVotes = async (req, res) => {
    try {
      const entries = await GuestbookModel.find().sort({ createdAt: -1 });
      
      // Fetch corresponding votes for each entry
      const entriesWithVotes = await Promise.all(entries.map(async (entry) => {
        const votes = await VoteModel.find({ entryId: entry._id });
        return { ...entry._doc, votes };  // Merge entry with its votes
      }));
  
      res.send(entriesWithVotes);
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err, msg: "방명록과 투표 데이터를 불러오지 못했습니다." });
    }
  };

module.exports.createEntry = async (req, res) => {
    const { name, message, image } = req.body
    GuestbookModel.create({ name, message, image })
    .then((data) => {
        console.log("방명록 작성 성공");
        res.status(201).send(data)
    }).catch((err) => {
        console.log(err);
        res.send({ error: err, msg: "방명록 작성 실패!" });
    });
}

module.exports.updateEntry = async (req, res) => {
    const { id } = req.params
    const { name, message, image } = req.body
    
    GuestbookModel.findByIdAndUpdate(id, { name, message, image })
    .then(() => res.send("방명록 수정 성공"))    
    .catch((err) => {
        console.log(err);
        res.send({ error: err, msg: "방명록 수정 실패!" });
    });
}

module.exports.deleteEntry = async (req, res) => {
    const { id } = req.params
    
    GuestbookModel.findByIdAndDelete(id)
    .then(() => res.send("방명록 삭제 성공"))    
    .catch((err) => {
        console.log(err);
        res.send({ error: err, msg: "방명록 삭제 실패!" });
    });
}

module.exports.getNames = async (req, res) => {
    try {
        const names = await GuestbookModel.find({}, 'name')
        res.send(names.map(entry => entry.name))
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, msg: "이름 조회 실패!" });
    }
}

// 투표 기능
module.exports.voteForEntry = async (req, res) => {
    const { entryId, question } = req.body;
  
    try {
      let vote = await VoteModel.findOne({ entryId, question });
      if (vote) {
        // If a vote for this entry and question exists, increment the count
        vote.count += 1;
        await vote.save();
      } else {
        // Otherwise, create a new vote
        vote = await VoteModel.create({ entryId, question });
      }
      res.status(200).send(vote);
    } catch (err) {
      console.log(err);
      res.status(500).send({ error: err, msg: "투표 업데이트 실패!" });
    }
  };