import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchagain, setfetchagain,fetchmesages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { selectedchat, setselectedchat, user } = ChatState();
    const [groupchatname, setgroupchatname] = useState()
    const [search, setsearch] = useState("")
    const [searchresult, setsearchresult] = useState([])
    const [loading, setloading] = useState(false)
    const [renameloading, setrenameloading] = useState(false)

    const toast = useToast();

    const handleRemove = async (user1) => {
        if (selectedchat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only Admin can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedchat._id,
                userId: user1._id,
            },
                config
            )
            user1._id === user._id ? setselectedchat() : setselectedchat(data)
            setselectedchat(data)
            setfetchagain(!fetchagain)
            fetchmesages();
            setloading(false)

        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setrenameloading(false)
        }
    }

    const handleRename = async () => {
        if (!groupchatname) return;
        try {
            setrenameloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            }

            const { data } = await axios.put("/api/chat/rename",
                {
                    chatId: selectedchat._id,
                    chatName: groupchatname,
                },
                config
            )

            setselectedchat(data)
            setfetchagain(!fetchagain)
            setrenameloading(false)

        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setrenameloading(false)
        }

        setgroupchatname("")
    }

    const handleSearch = async (query) => {
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

    const handleAdduser = async (user1) => {
        if (selectedchat.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in Group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (selectedchat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admin can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectedchat._id,
                userId: user1._id,
            },
                config
            )
            setselectedchat(data)
            setfetchagain(!fetchagain)
            setloading(false)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setrenameloading(false)
        }
    }

    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedchat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedchat.users.map((u) => (
                                <UserBadgeItem key={user._id} user={u}
                                    handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupchatname}
                                onChange={(e) => setgroupchatname(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl >
                            <Input
                                placeholder='Add User to Group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        {loading ? (<Spinner size="lg" />
                        ) :
                            (searchresult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAdduser(user)}
                                />

                            ))
                            )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal