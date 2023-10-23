const express = require("express")
const { registeruser, authuser, allusers } = require("../Controller/userController")
const router = express.Router();
const { protect } = require("../middleware/authmiddleware")

router.route("/").post(registeruser).get(protect, allusers)
router.post("/login", authuser)

module.exports = router ;