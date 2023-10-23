import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupchatname, setgroupchatname] = useState();
    const [selectedusers, setselectedusers] = useState([]);
    const [search, setsearch] = useState("");
    const [searchresult, setsearchresult] = useState([]);
    const [loading, setloading] = useState(false);
    const toast = useToast();

    const { user, chats, setchats } = ChatState();

    const handlesearch = async (query) => {
        setsearch(query)
        if (!query) {
            return;
        }
        try {
            setloading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            console.log(data)
            setloading(false)
            setsearchresult(data)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the Search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    const handlesubmit = async () => {
        if (!groupchatname || !selectedusers) {
            toast({
                title: "Please Fill All the Fields",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }
            const { data } = await axios.post("/api/chat/group", {
                name: groupchatname,
                users: JSON.stringify(selectedusers.map((u) => u._id))
            }, config)
            setchats([data, ...chats])
            onClose();
            toast({
                title: "New Group Created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });

        } catch (error) {
            toast({
                title: "Failed to Create the Chat",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
    }

    const handleDelete = (deleteuser) => {
        setselectedusers(
            selectedusers.filter((sel) => sel._id !== deleteuser._id)
        );
    }

    const handlegroup = (usertoadd) => {
        if (selectedusers.includes(usertoadd)) {
            toast({
                title: "User Already Added",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
        setselectedusers([...selectedusers, usertoadd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input placeholder='ChatName' mb={3}
                                onChange={(e) => setgroupchatname(e.target.value)} />
                            <Input placeholder='Add Users' mb={1}
                                onChange={(e) => handlesearch(e.target.value)} />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedusers.map((u) => (
                                <UserBadgeItem key={user._id} user={u}
                                    handleFunction={() => handleDelete(u)} />
                            ))}
                        </Box>
                        {loading
                            ? <div>loading</div>
                            : searchresult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user}
                                    handleFunction={() => handlegroup(user)} />
                            ))
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handlesubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal