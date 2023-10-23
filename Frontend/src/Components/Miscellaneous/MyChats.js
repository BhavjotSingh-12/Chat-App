import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from '../ChatLoading';
import { getsender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchagain }) => {
  const [loggeduser, setloggeduser] = useState();
  const { user, selectedchat, setselectedchat, chats, setchats } = ChatState();

  const toast = useToast();

  const fetchchats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      // console.log(data)
      setchats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  }
  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchats();
  }, [fetchagain])

  return (
    <Box
      display={{ base: selectedchat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="80%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (

          <Stack overflowY="scroll"   >
            {chats.map((chat) => (
              <Box
                onClick={() => setselectedchat(chat)}
                cursor="pointer"
                bg={selectedchat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedchat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupchat
                    ? getsender(loggeduser, chat.users)
                    : chat.chatName
                  }
                  {/* {console.log(chat.chatName)} */}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats