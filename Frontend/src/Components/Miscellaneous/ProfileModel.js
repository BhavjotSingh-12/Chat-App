import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                    onClick={onOpen}
                />
            )}

            <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                
                >
                    <ModalHeader
                        fontFamily="Work sans"
                        fontSize="40px"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={user.profilePic}
                            alt={user.name}
                        />
                        <Text
                            fontFamily="Work sans"
                            fontSize={{ base: "25px", md: "30px" }}
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModel