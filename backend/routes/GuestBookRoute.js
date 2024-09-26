const { Router } = require("express")

const { voteForEntry, getEntries, createEntry, updateEntry, deleteEntry, getEntriesWithVotes } = require("../controllers/GuestBookControllers")

const router = Router()

router.get("/entries", getEntries);
router.post('/create', createEntry);
router.put('/update/:id', updateEntry);
router.delete('/delete/:id', deleteEntry);
//router.get("/entries", getEntriesWithVotes);

router.post('/vote', voteForEntry); 

module.exports = router