import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getsender, getsenderfull } from "../config/ChatLogics"
import ProfileModel from './Miscellaneous/ProfileModel';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./style.css"
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import Lottie from "react-lottie";
import animationData from "../animations/typing.json"

// const ENDPOINT = "http://localhost:5000"
const ENDPOINT = "https://chat-buddy-3yn4.onrender.com"
var socket, selectedchatcompare;

const SingleChat = ({ fetchagain, setfetchagain }) => {

    const [messages, setmessages] = useState([]);
    const [loading, setloading] = useState(false);
    const [newmessage, setnewmessage] = useState();
    const [socketconnected, setsocketconnected] = useState(false);
    const [typing, settyping] = useState(false);
    const [istyping, setistyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };

    const toast = useToast();
    const { user, selectedchat, setselectedchat, notification, setnotification } = ChatState();


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newmessage) {
            socket.emit("Stop Typing", selectedchat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }

                setnewmessage("")

                const { data } = await axios.post("/api/message",
                    {
                        content: newmessage,
                        chatId: selectedchat._id,
                    },
                    config
                )
                console.log(data)

                socket.emit('new message', data)
                setmessages([...messages, data])

            } catch (error) {
                toast({
                    title: "Error Occured",
                    description: "Failed to send the messgae",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                return;
            }
        }
    }

    const fetchmesages = async () => {
        if (!selectedchat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            setloading(true)

            const { data } = await axios.get(
                `/api/message/${selectedchat._id}`,
                config
            )

            console.log(messages)
            setmessages(data);
            setloading(false);

            socket.emit('join chat', selectedchat._id)

        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the messgae",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user)
        socket.on('connected', () => setsocketconnected(true))
        socket.on("typing", () => setistyping(true));
        socket.on("stoptyping", () => setistyping(false));
    }, []);


    useEffect(() => {
        fetchmesages();
        selectedchatcompare = selectedchat;
    }, [selectedchat])


    useEffect(() => {
        socket.on('Message recieved', (newmessageRecieved) => {
            if (!selectedchatcompare ||
                selectedchatcompare._id !== newmessageRecieved.chat._id) {
                if (!notification.includes(newmessageRecieved)) {
                    setnotification([newmessageRecieved, ...notification])
                    setfetchagain(!fetchagain)
                }
            } else {
                setmessages([...messages, newmessageRecieved])
            }
        })
    })



    const typinghandler = (e) => {
        setnewmessage(e.target.value)
        // Typing Indicator Logic

        if (!socketconnected) return;

        if (!typing) {
            settyping(true);
            socket.emit('typing', selectedchat._id)
        }

        let lasttypingtime = new Date().getTime()
        var timerlength = 3000;
        setTimeout(() => {
            var timenow = new Date().getTime()
            var timediff = timenow - lasttypingtime

            if (timediff >= timerlength && typing) {
                socket.emit("stoptyping", selectedchat._id)
                settyping(false)
            }
        }, timerlength);
    }

    return (
        <>
            {
                selectedchat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={2}
                            px={2}
                            w="100%"
                            fontFamily="Work sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<ArrowBackIcon />}
                                onClick={() => setselectedchat("")}
                            />
                            {!selectedchat.isGroupchat ? (<>
                                {getsender(user, selectedchat.users)}
                                <ProfileModel user={getsenderfull(user, selectedchat.users)} />
                            </>)
                                : (
                                    <>
                                        {selectedchat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchagain={fetchagain}
                                            setfetchagain={setfetchagain}
                                            fetchmesages={fetchmesages} />
                                    </>
                                )}
                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size="xl"
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : (
                                <div className='messages'>
                                    <ScrollableChat messages={messages} />
                                </div>
                            )}
                            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
                                {istyping ?
                                    (<div>
                                        <Lottie
                                            options={defaultOptions}
                                            width={70}
                                            style={{ marginBottom: 15, marginLeft: 0 }}
                                        />
                                    </div>)
                                    : (<></>)}
                                <Input
                                    placeholder='Enter a message'
                                    variant="filled"
                                    bg="#E0E0E0"
                                    value={newmessage}
                                    onChange={typinghandler}
                                />
                            </FormControl>
                        </Box>
                    </>
                )
                    : (
                        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                                Click on a user to start chatting
                            </Text>
                        </Box>
                    )}
        </>
    )
}

export default SingleChat