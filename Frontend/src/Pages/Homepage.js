import React, { useEffect } from 'react'
import { Container, Box, Text } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import SignUp from '../Components/Authentication/SignUp'
import { useNavigate } from 'react-router-dom'

const Homepage = () => {
  const navigate = useNavigate();
  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      // setuser(userInfo)

      if (user) {
          navigate("/chats")
      }
  }, [navigate])


  return (
    <Container maxW="xl" centerContent  >
      <Box
        d="flex"
        p={3}
        bg={"white"}
        justifyContent="center"
        borderRadius="lg"
        w="100%"
        borderWidth="1px"
        m="40px 0 15px 0"
      >
        <Text
          fontWeight="medium"
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
          justifyContent="center"
          textAlign="center"
          bg="white">Chat-Buddy</Text>
      </Box>
      <Box
        bg="white"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" >
          <TabList mb="1em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container >
  )
}

export default Homepage