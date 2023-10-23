import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [show, setshow] = useState(false)
    const [password, setpass] = useState();
    const [email, setmail] = useState();
    const [loading, setloading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate();

    const handleConfirm = () => {
        setshow(!show)
    }

    const submithandle = async () => {
        setloading(true);
        if (!email || !password) {
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

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );

            toast({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            //   setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setloading(false);
            navigate("/chats");
            window.location.reload(true);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setloading(false);
        }
    };

    return (
        <VStack spacing="5px">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email...'
                    onChange={(e) => setmail(e.target.value)}
                    value={email}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Enter Your password...'
                        type={show ? "text" : "password"}
                        value={password}
                        onChange={(e) => setpass(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.7rem" size="sm" onClick={handleConfirm}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme='blue'
                style={{ marginTop: 15 }}
                onClick={submithandle}
                width="100%"
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={() => {
                    setmail("guest@example.com");
                    setpass("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack >
    )
}

export default Login