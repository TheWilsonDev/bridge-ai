import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, VStack, Button, Text, HStack, Avatar, Icon, Input, InputGroup, InputLeftElement, Divider, IconButton, useToast, Menu, MenuButton, MenuList, MenuItem, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Portal } from "@chakra-ui/react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineMessage, AiOutlineSearch, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { FaHome, FaComments, FaCog, FaRobot, FaCheck, FaTimes, FaEllipsisV, FaEdit, FaTrash, FaBolt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getChats, updateChat, addChat, deleteChat } from "../../firebase/chatOperations";

const ChatItem = ({ chat, isActive, onClick, onChatUpdate }) => {
  const [editedTitle, setEditedTitle] = useState(chat.title);
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const handleDelete = async () => {
    try {
      await deleteChat(chat.id);
      onChatUpdate(chat, true);
      onClose();
      toast({
        title: "Chat deleted",
        description: "The chat has been permanently deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Error deleting chat",
        description: "Failed to delete the chat. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleTitleSave = async () => {
    if (editedTitle.trim() && editedTitle !== chat.title) {
      try {
        console.log("Updating chat title in Firebase:", {
          chatId: chat.id,
          newTitle: editedTitle.trim(),
          oldTitle: chat.title,
        });

        // Update in Firebase
        await updateChat(chat.id, {
          title: editedTitle.trim(),
          lastActive: Date.now(),
        });

        console.log("Firebase update successful");

        // Update local state
        const updatedChat = {
          ...chat,
          title: editedTitle.trim(),
          lastActive: Date.now(),
        };

        console.log("Updating local state with:", updatedChat);
        onChatUpdate(updatedChat);
        setIsEditing(false);

        toast({
          title: "Chat name updated",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        console.error("Error updating chat title:", error);
        toast({
          title: "Error updating chat name",
          description: error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
      }
    } else {
      setEditedTitle(chat.title);
      setIsEditing(false);
    }
  };

  return (
    <>
      <Box p={3} cursor="pointer" borderRadius="md" position="relative" onClick={isEditing ? undefined : onClick} transition="all 0.2s" width="100%" mr={2}>
        {/* Background layer */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={isActive ? "rgba(255, 255, 255, 0.03)" : "transparent"}
          backdropFilter={isActive ? "blur(8px)" : "none"}
          borderRadius="md"
          transition="all 0.2s"
          _before={{
            content: '""',
            position: "absolute",
            top: "-1px",
            left: "-1px",
            right: "-1px",
            bottom: "-1px",
            borderRadius: "md",
            padding: "1px",
            background: isActive
              ? `linear-gradient(45deg, 
                  ${chat.color}44, 
                  ${chat.color}22, 
                  ${chat.color}44, 
                  ${chat.color}22, 
                  ${chat.color}44)`
              : "transparent",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: isActive ? 1 : 0,
            transition: "opacity 0.3s",
            animation: isActive ? "borderFlow 3s linear infinite" : "none",
            backgroundSize: "300% 300%",
          }}
        />

        {/* Content layer */}
        <VStack align="start" spacing={1} position="relative" zIndex={1}>
          <Flex justify="space-between" width="100%" align="center">
            <Flex justify="space-between" width="100%" align="center">
              {isEditing ? (
                <HStack spacing={2} flex={1}>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleTitleSave();
                      } else if (e.key === "Escape") {
                        setEditedTitle(chat.title);
                        setIsEditing(false);
                      }
                    }}
                    size="sm"
                    variant="unstyled"
                    color="white"
                    width="auto"
                    minW="100px"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  <IconButton
                    icon={<FaCheck />}
                    size="xs"
                    variant="ghost"
                    colorScheme="green"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTitleSave();
                    }}
                  />
                  <IconButton
                    icon={<FaTimes />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditedTitle(chat.title);
                      setIsEditing(false);
                    }}
                  />
                </HStack>
              ) : (
                <Text color="white" fontSize="sm" fontWeight="medium" noOfLines={1} position="relative" zIndex={2}>
                  {chat.title}
                </Text>
              )}
              <HStack spacing={2}>
                <Box w={2} h={2} borderRadius="full" bg={chat.color} flexShrink={0} boxShadow={`0 0 10px ${chat.color}66`} position="relative" zIndex={2} />
                <Menu isLazy placement="right-start">
                  <MenuButton as={IconButton} icon={<FaEllipsisV />} variant="ghost" size="xs" color="whiteAlpha.700" _hover={{ color: "white", bg: "whiteAlpha.100" }} onClick={(e) => e.stopPropagation()} />
                  <Portal>
                    <MenuList
                      bg="#0f1117"
                      borderColor="whiteAlpha.200"
                      boxShadow="dark-lg"
                      py={2}
                      minW="150px"
                      zIndex={2000}
                      sx={{
                        "& > *": {
                          position: "relative",
                          zIndex: 2001,
                        },
                      }}
                    >
                      <MenuItem icon={<FaEdit />} onClick={(e) => handleEditClick(e)} bg="#0f1117" _hover={{ bg: "whiteAlpha.100" }} color="white" fontSize="sm">
                        Edit Name
                      </MenuItem>
                      <MenuItem icon={<FaTrash />} onClick={(e) => handleDeleteClick(e)} bg="#0f1117" _hover={{ bg: "whiteAlpha.100" }} color="red.300" fontSize="sm">
                        Delete Chat
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </HStack>
            </Flex>
          </Flex>
          <Text color="whiteAlpha.600" fontSize="xs" noOfLines={1} position="relative" zIndex={2}>
            {chat.agent.name}
          </Text>
        </VStack>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="#1a1d27" border="1px solid" borderColor="whiteAlpha.200">
          <ModalHeader color="white">Delete Chat</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody color="whiteAlpha.800">Are you sure you want to delete this chat? This action cannot be undone and all messages will be permanently lost.</ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} color="white">
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const accentColor = "cyan.400";
  const hoverColor = "cyan.200";
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch chats from Firebase
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chats = await getChats();
        setActiveChats(chats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chats:", error);
        toast({
          title: "Error fetching chats",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleChatClick = (chat) => {
    console.log("Chat clicked:", chat);
    if (selectedChat?.id === chat.id) {
      console.log("Same chat already selected, returning");
      return;
    }

    const chatState = {
      existingChat: true,
      id: chat.id,
      agent: chat.agent,
      category: chat.category,
      color: chat.color,
      title: chat.title,
      messages: chat.messages || [],
      lastActive: chat.lastActive,
    };

    console.log("Created chatState:", chatState);

    // Store in session storage first
    sessionStorage.setItem("currentChat", JSON.stringify(chatState));
    console.log("Chat stored in sessionStorage");

    // Update selected chat
    setSelectedChat(chatState);
    console.log("Selected chat updated");

    // Navigate last, and ensure we're using push instead of replace
    console.log("Navigating to chat page...");
    navigate("/dashboard/chat", {
      state: chatState,
    });
  };

  // Update selected chat when location changes
  useEffect(() => {
    console.log("Location changed:", location);
    const currentPath = location.pathname;
    console.log("Current path:", currentPath);

    // If we're on the chat page
    if (currentPath === "/dashboard/chat") {
      // Try to get chat from location state or session storage
      const chatState = location.state || JSON.parse(sessionStorage.getItem("currentChat"));
      console.log("Retrieved chatState:", chatState);
      if (chatState?.id) {
        console.log("Setting selected chat from location change");
        setSelectedChat(chatState);
      } else {
        console.log("No valid chatState found");
        // If no chat state is found, redirect to home
        navigate("/dashboard/home", { replace: true });
      }
    }
  }, [location]);

  // Keep selected chat in sync with active chats
  useEffect(() => {
    console.log("Active chats updated:", activeChats);
    if (selectedChat?.id) {
      console.log("Looking for chat with id:", selectedChat.id);
      const chat = activeChats.find((c) => c.id === selectedChat.id);
      if (chat) {
        console.log("Found matching chat, updating selected chat");
        setSelectedChat({
          ...selectedChat,
          messages: chat.messages || [],
          title: chat.title,
          lastActive: chat.lastActive,
        });
      } else {
        console.log("No matching chat found in activeChats");
      }
    }
  }, [activeChats]);

  // Add debugging for render
  console.log("Current state:", {
    pathname: location.pathname,
    selectedChat: selectedChat?.id,
    activeChatsCount: activeChats.length,
    locationState: location.state,
  });

  // Handle new chat creation from agent selection
  useEffect(() => {
    if (location.state?.agent && !location.state?.existingChat) {
      const createNewChat = async () => {
        try {
          const newChat = {
            agent: location.state.agent,
            category: location.state.category,
            color: location.state.color,
            title: "New Chat", // Explicitly set default title
            lastActive: Date.now(),
            messages: [],
          };

          // Create the chat in Firebase
          const createdChat = await addChat(newChat);
          console.log("Created chat:", createdChat);

          // Update local state with the new chat
          setActiveChats((prev) => [createdChat, ...prev]);
          setSelectedChat(createdChat);

          const chatState = {
            existingChat: true,
            id: createdChat.id,
            agent: createdChat.agent,
            category: createdChat.category,
            color: createdChat.color,
            title: createdChat.title,
            messages: createdChat.messages || [],
            lastActive: createdChat.lastActive,
          };

          // Store chat state in sessionStorage
          sessionStorage.setItem("currentChat", JSON.stringify(chatState));

          navigate("/dashboard/chat", {
            state: chatState,
          });
        } catch (error) {
          console.error("Error creating new chat:", error);
          toast({
            title: "Error creating new chat",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };

      createNewChat();
    }
  }, [location.state?.agent, location.state?.existingChat]);

  // Handle chat updates from ChatPage
  useEffect(() => {
    if (location.state?.existingChat && location.state?.id) {
      const updateChatData = async () => {
        try {
          const chatIndex = activeChats.findIndex((c) => c.id === location.state.id);
          if (chatIndex === -1) return;

          const updatedChat = {
            ...activeChats[chatIndex],
            messages: location.state.messages || activeChats[chatIndex].messages,
            title: location.state.title || activeChats[chatIndex].title,
          };

          // Only update if messages have changed
          if (location.state.messages && JSON.stringify(location.state.messages) !== JSON.stringify(activeChats[chatIndex].messages)) {
            updatedChat.lastActive = Date.now();
            await updateChat(location.state.id, {
              messages: updatedChat.messages,
              title: updatedChat.title,
              lastActive: updatedChat.lastActive,
            });

            setActiveChats((prev) => {
              const newChats = [...prev];
              newChats[chatIndex] = updatedChat;
              return newChats.sort((a, b) => b.lastActive - a.lastActive);
            });
          } else if (location.state.title !== activeChats[chatIndex].title) {
            await updateChat(location.state.id, {
              title: updatedChat.title,
            });

            setActiveChats((prev) => {
              const newChats = [...prev];
              newChats[chatIndex] = updatedChat;
              return newChats;
            });
          }
        } catch (error) {
          console.error("Error updating chat:", error);
          toast({
            title: "Error updating chat",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      };

      updateChatData();
    }
  }, [location.state?.messages, location.state?.title]);

  const handleChatUpdate = (updatedChat, isDelete = false) => {
    if (isDelete) {
      // For deletion, filter out the chat that was deleted using updatedChat.id
      setActiveChats((prev) => prev.filter((chat) => chat.id !== updatedChat.id));
      if (selectedChat?.id === updatedChat.id) {
        setSelectedChat(null);
        navigate("/dashboard/home");
      }
    } else if (updatedChat) {
      // For updates, we update the matching chat
      setActiveChats((prev) => prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)));
      if (selectedChat?.id === updatedChat.id) {
        setSelectedChat(updatedChat);
      }
    }
  };

  return (
    <Flex h="100vh" bg="#0f1117" userSelect="none" overflow="hidden">
      {/* Sidebar */}
      <Box w="250px" bg="#1a1d27" borderRight="1px" borderColor="whiteAlpha.100" display="flex" flexDirection="column" height="100vh" overflow="hidden">
        {/* Top Section with Logo and New Chat */}
        <VStack spacing={0} flex="none">
          {/* Logo/Header */}
          <Box w="100%" p={5} pb={4}>
            <HStack
              spacing={1}
              pb={4}
              borderBottom="1px"
              borderColor="whiteAlpha.100"
              justify="center"
              position="relative"
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-1px",
                left: "25%",
                right: "25%",
                height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
              }}
            >
              <Text fontSize="2xl" fontWeight="700" letterSpacing="wider" color="white" textShadow="0 0 20px rgba(255, 255, 255, 0.5)">
                BRIDGE
              </Text>
              <Text fontSize="2xl" fontWeight="400" letterSpacing="wider" color="whiteAlpha.800" textShadow="0 0 10px rgba(255, 255, 255, 0.3)">
                AI
              </Text>
            </HStack>
          </Box>

          {/* New Chat Button */}
          <Box w="100%" pt={2} px={5} pb={5}>
            <Button
              width="100%"
              color="white"
              bg="rgba(255, 255, 255, 0.03)"
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="transparent"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
              pl="16px"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "md",
                padding: "1px",
                background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              _hover={{
                bg: "rgba(255, 255, 255, 0.05)",
                _before: {
                  background: "linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.4), rgba(255,255,255,0.2))",
                },
                transform: "translateY(-1px)",
                boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              }}
              _active={{
                transform: "translateY(1px)",
              }}
              transition="all 0.2s"
              onClick={() => navigate("/dashboard/home")}
              leftIcon={<Icon as={AiOutlinePlus} color="white" fontSize="18px" mr="2px" />}
              size="lg"
              fontWeight="medium"
              boxShadow="0 2px 10px rgba(0,0,0,0.2)"
            >
              New Chat
            </Button>
          </Box>
        </VStack>

        {/* Active Chats Section - Takes remaining space */}
        <Box flex="1" minH={0} display="flex" flexDirection="column">
          {/* Active Chats Header */}
          <Box px={5}>
            <Text color="whiteAlpha.700" fontSize="sm" fontWeight="medium" letterSpacing="0.05em" textTransform="uppercase" position="relative" pb={2}>
              Active Chats
            </Text>
          </Box>

          {/* Scrollable Chats List */}
          <Box
            flex="1"
            overflowY="auto"
            overflowX="hidden"
            px={5}
            pt={2}
            sx={{
              "&::-webkit-scrollbar": {
                width: "3px",
              },
              "&::-webkit-scrollbar-track": {
                width: "3px",
                background: "rgba(255, 255, 255, 0.05)",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                borderRadius: "24px",
              },
            }}
          >
            <VStack spacing={1} align="stretch" width="100%" pb={2}>
              {activeChats.map((chat) => (
                <Box key={chat.id} width="100%">
                  <ChatItem chat={chat} isActive={location.pathname === "/dashboard/chat" && selectedChat?.id === chat.id} onClick={() => handleChatClick(chat)} onChatUpdate={handleChatUpdate} />
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Credit Display - Add before Profile Section */}
        <Box
          position="relative"
          bg="rgba(0, 0, 0, 0.2)"
          p={3}
          mx={4}
          mb={4}
          borderRadius="lg"
          border="1px solid"
          borderColor="whiteAlpha.200"
          _before={{
            content: '""',
            position: "absolute",
            inset: "-1px",
            padding: "1px",
            borderRadius: "lg",
            background: "linear-gradient(45deg, #4299E1, #2B6CB0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            opacity: 0.5,
          }}
        >
          <VStack spacing={1.5} align="stretch">
            <HStack justify="space-between">
              <Text color="whiteAlpha.900" fontSize="sm" fontWeight="semibold">
                Credits Used This Month
              </Text>
              <Icon as={FaBolt} color="blue.400" w={4} h={4} filter="drop-shadow(0 0 8px rgba(66, 153, 225, 0.5))" />
            </HStack>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" bgGradient="linear(to-r, blue.200, blue.500)" bgClip="text" textShadow="0 0 20px rgba(66, 153, 225, 0.3)">
                  2,500
                </Text>
                <Button
                  variant="link"
                  size="xs"
                  color="blue.400"
                  fontWeight="medium"
                  _hover={{
                    color: "blue.300",
                    textDecoration: "none",
                    transform: "translateX(2px)",
                  }}
                  _active={{
                    color: "blue.500",
                    transform: "translateX(0px)",
                  }}
                  rightIcon={<Icon as={FaArrowRight} w={3} h={3} />}
                  transition="all 0.2s"
                  onClick={() => navigate("/dashboard/settings/usage")}
                >
                  View Usage Details
                </Button>
              </VStack>
            </HStack>
            <HStack spacing={3} align="center" pt={1}>
              <Divider borderColor="whiteAlpha.400" />
              <Text fontSize="xs" color="whiteAlpha.400" whiteSpace="nowrap">
                or
              </Text>
              <Divider borderColor="whiteAlpha.400" />
            </HStack>
            <VStack spacing={2} align="center" pt={1}>
              <Text color="whiteAlpha.600" fontSize="xs" fontWeight="medium">
                Developer Plan
              </Text>
              <Button
                width="100%"
                size="sm"
                bg="whiteAlpha.100"
                color="white"
                fontSize="xs"
                fontWeight="medium"
                height="32px"
                position="relative"
                onClick={() => navigate("/dashboard/settings/usage")}
                _hover={{
                  bg: "whiteAlpha.200",
                  transform: "translateY(-1px)",
                  _before: {
                    opacity: 1,
                  },
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
                _before={{
                  content: '""',
                  position: "absolute",
                  inset: "-1px",
                  padding: "1px",
                  borderRadius: "md",
                  background: "linear-gradient(45deg, #4299E1, #2B6CB0)",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                rightIcon={<Icon as={FaArrowRight} w={3} h={3} />}
              >
                Use Your API Key
              </Button>
            </VStack>
          </VStack>
        </Box>

        {/* Profile Section */}
        <Box p={4} borderTop="1px" borderColor="whiteAlpha.100" bg="rgba(26, 32, 44, 0.4)" backdropFilter="blur(10px)" position="relative">
          <HStack spacing={3} justify="space-between">
            <HStack spacing={3}>
              <Avatar size="sm" name="User" bg={accentColor} />
              <Text color="white" fontWeight="medium">
                John Doe
              </Text>
            </HStack>
            <Icon
              as={FaCog}
              color="white"
              cursor="pointer"
              onClick={() => navigate("/dashboard/settings/user")}
              _hover={{
                color: accentColor,
                transform: "rotate(180deg)",
              }}
              transition="all 0.3s ease-in-out"
              w={5}
              h={5}
            />
          </HStack>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flex={1} bg="#0f1117" overflow="hidden">
        <Outlet context={{ activeChats, setActiveChats, selectedChat, setSelectedChat }} />
      </Box>
    </Flex>
  );
};

// Add this at the end of the file, before the export
const styles = `
@keyframes borderFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`;

const styleElement = document.createElement("style");
styleElement.textContent = styles;
document.head.appendChild(styleElement);

export default DashboardLayout;
