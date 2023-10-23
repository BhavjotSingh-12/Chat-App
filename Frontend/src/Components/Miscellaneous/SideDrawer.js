import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../Context/ChatProvider'
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import { useToast } from "@chakra-ui/react";
import axios from "axios"
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getsender } from '../../config/ChatLogics'
import NotificationBadge, { Effect } from "react-notification-badge"

const SideDrawer = () => {
  const [search, setsearch] = useState()
  const [searchresult, setsearchresult] = useState([])
  const [loading, setloading] = useState(false)
  const [loadingChat, setloadingchat] = useState()
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();

  const { user, setselectedchat, chats, setchats, notification, setnotification } = ChatState();

  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  }
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
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
      setloading(false)
      setsearchresult(data)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setloading(false);
    }
  }
  const accessChat = async (userId) => {

    try {
      setloadingchat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      }

      const { data } = await axios.post("/api/chat", { userId }, config)

      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats])
      setselectedchat(data)
      setloadingchat(false)
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setloading(false);
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent='space-between'
        alignItems="center"
        bg="white"
        w="100%"
        borderWidth="5px"
        p="12px"
      >
        <Tooltip
          label="Search users for Chat"
          hasArrow
          placement='bottom'>
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: "black" }}></i>
            <Text d={{ base: "none", md: "flex" }} px="4" color="black">Search User</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">Chat-Buddy</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={1}>
              {!notification.length && "No New Messages"}
              {notification.map(not => (
                <MenuItem ket={not._id} onClick={() => {
                  setselectedchat(not.chat)
                  setnotification(notification.filter((n) => n !== not))
                }}>
                  {not.chat.isGroupchat ?
                    `New Message in ${not.chat.chatName}`
                    : `New message from ${getsender(user, not.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name}
                src={user.profilePic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logouthandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box
              display="flex"
              pb={2}
            >
              <Input
                placeholder='Search by name or email'
                mr={2}
                value={search}
                onChange={(e) => { setsearch(e.target.value) }}
              />
              <Button
                onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchresult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer >
    </>
  )
}

export default SideDrawer