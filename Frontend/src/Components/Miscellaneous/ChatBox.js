import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SingleChat from '../SingleChat';

const ChatBox = ({ fetchagain, setfetchagain }) => {
  const { selectedchat } = ChatState();

  return (
    <Box
      display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
      w={{ base: "100%", md: "68%" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchagain={fetchagain} setfetchagain={setfetchagain} />
    </Box>
  )
}

export default ChatBox