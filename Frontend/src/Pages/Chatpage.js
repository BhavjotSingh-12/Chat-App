import React, { useEffect, useState } from 'react'
import axios from "axios";
import { ChatState } from '../Context/ChatProvider';
import { Box } from "@chakra-ui/react"
import MyChats from '../Components/Miscellaneous/MyChats';
import ChatBox from '../Components/Miscellaneous/ChatBox';
import SideDrawer from '../Components/Miscellaneous/SideDrawer';


const Chatpage = () => {
    const { user } = ChatState()
    const [fetchagain, setfetchagain] = useState(false)
    return (
        <div style={{ width: "100%", color: "" }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent={'space-between'}
                w="100%"
                h="89.5vh"
                p="20px"
            >
                {user && <ChatBox fetchagain={fetchagain} setfetchagain={setfetchagain} />}
                {user && <MyChats fetchagain={fetchagain} />}
            </Box>
        </div >
    )
}

export default Chatpage