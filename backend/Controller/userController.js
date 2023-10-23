const asyncHandler = require("express-async-handler")
const User = require("../Models/UserModel");
const generateToken = require("../config/generateToken");

const registeruser = asyncHandler(async (req, res) => {
    const { name, email, password, profilePic } = req.body
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fields")
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists")
    }
    const user = await User.create({
        name,
        email,
        password,
        profilePic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Failed to create the user")
    }
})

const authuser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchpassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Inavlid Email or Password")
    }
})


const allusers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users)
  
})

module.exports = { registeruser, authuser, allusers };