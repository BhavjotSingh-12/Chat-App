import React, { useState } from 'react'
import { Stack, VStack, Box, FormControl, FormLabel, Input, InputRightElement, Button, InputGroup } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setname] = useState()
    const [email, setemail] = useState()
    const [password, setpassword] = useState()
    const [confirm, setconfirm] = useState()
    const [profilePic, setprofilePic] = useState()
    const [show, setshow] = useState(false)
    const [showconfirm, setshowconfirm] = useState(false)
    const [loading, setloading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate();

    const handleClick = () => {
        setshow(!show)
    }
    const handleConfirm = () => {
        setshowconfirm(!showconfirm)
    }
    const postDetails = (pics) => {
        setloading(true);
        if (pics === undefined) {
            toast({
                title: 'Please Add an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        console.log(pics)
        if (pics.type === "image/jpeg" || pics.type === "image/PNG") {
            const data = new FormData();
            data.append("file", pics)
            data.append("upload_preset", "chatApp")
            data.append("cloud_name", "chat-appv")
                axios.post("https://api.cloudinary.com/v1_1/chat-appv/image/upload", data)
                .then((res) => {
                    setprofilePic(res.data.url.toString());
                    console.log(res.data.url.toString())
                    setloading(false);
                })
                .catch((err) => {
                    console.log(err)
                    setloading(false)
                })
        } else {
            toast({
                title: 'Please Select an Image',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setloading(false);
            return;
        }

    }
    const submithandle = async () => {
        setloading(true);
        if (!name || !email || !password || !confirm) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloading(false);
            return;
        }
        if (password !== confirm) {
            toast({
                title: "Passwords do not match!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom-right",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user",
                { name, email, password, profilePic },
                config
            )
            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            setloading(false)
            navigate("/chats")
            window.location.reload(true);
        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            setloading(false);
        }
    }

    return (
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter Your Name...'
                    onChange={(e) => setname(e.target.value)}
                />
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email...'
                    onChange={(e) => setemail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Enter Your password...'
                        type={show ? "text" : "password"}
                        onChange={(e) => setpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.7rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Enter Your password...'
                        type={showconfirm ? "text" : "password"}
                        onChange={(e) => setconfirm(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.7rem" size="sm" onClick={handleConfirm}>
                            {showconfirm ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='pic' >
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    placeholder='Enter Your Profile Picture...'
                    type='file'
                    p={1.5}
                    accept='image/'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme='blue'
                style={{ marginTop: 15 }}
                onClick={submithandle}
                width="100%"
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default SignUp