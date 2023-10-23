const asyncHandler = require("express-async-handler");
const Message = require("../Models/MessageModel");
const User = require("../Models/UserModel");
const Chat = require("../Models/chatModel");

const sendmessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }

    var newmessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        var message = await Message.create(newmessage);

        message = await message.populate("sender", "name profilePic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name profilePic email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
});


const allmessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name profilePic email")
            .populate("chat")

        res.json(messages)

    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
})


module.exports = { sendmessage, allmessages };



