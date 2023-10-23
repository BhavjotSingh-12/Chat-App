const express = require("express");
const { sendmessage, allmessages } = require("../Controller/messagecontroller");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.route('/').post(protect, sendmessage)
router.route("/:chatId").get(protect,allmessages)

module.exports = router;