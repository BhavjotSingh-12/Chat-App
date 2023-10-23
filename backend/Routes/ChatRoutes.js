const express = require("express");
const { protect } = require("../middleware/authmiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addtoGroup,removefromGroup } = require("../Controller/chatController");

const router = express.Router();

router.route('/').post(protect, accessChat)
router.get("/", protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/rename').put(protect, renameGroup)
router.route('/groupadd').put(protect, addtoGroup)
router.route('/groupremove').put(protect, removefromGroup)

module.exports = router;