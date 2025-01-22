import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, VStack, Button, Text, HStack, Avatar, Icon, Input, InputGroup, InputLeftElement, Divider, IconButton, useToast } from "@chakra-ui/react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineMessage, AiOutlineSearch, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { FaHome, FaComments, FaCog, FaRobot, FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getChats, updateChat, addChat } from "../../firebase/chatOperations";

const ChatItem = ({ chat, isActive, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(chat.title);
  const inputRef = useRef(null);

  const handleTitleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (editedTitle.trim()) {
      chat.title = editedTitle.trim();
    } else {
      setEditedTitle(chat.title);
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
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
              <Input ref={inputRef} value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onKeyDown={handleKeyPress} onBlur={handleBlur} size="sm" variant="unstyled" color="white" width="auto" minW="100px" onClick={(e) => e.stopPropagation()} autoFocus position="relative" zIndex={2} />
            ) : (
              <Text color="white" fontSize="sm" fontWeight="medium" noOfLines={1} onClick={handleTitleClick} cursor="text" position="relative" zIndex={2}>
                {chat.title}
              </Text>
            )}
            <Box w={2} h={2} borderRadius="full" bg={chat.color} flexShrink={0} ml={2} boxShadow={`0 0 10px ${chat.color}66`} position="relative" zIndex={2} />
          </Flex>
        </Flex>
        <Text color="whiteAlpha.600" fontSize="xs" noOfLines={1} position="relative" zIndex={2}>
          {chat.agent.name}
        </Text>
      </VStack>
    </Box>
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
    if (selectedChat?.id === chat.id) return;

    setSelectedChat(chat);
    navigate("/dashboard/chat", {
      state: {
        existingChat: true,
        id: chat.id,
        agent: chat.agent,
        category: chat.category,
        color: chat.color,
        title: chat.title,
        messages: chat.messages,
        lastActive: chat.lastActive,
      },
      replace: true,
    });
  };

  // Handle new chat creation from agent selection
  useEffect(() => {
    if (location.state?.agent && !location.state?.existingChat) {
      const createNewChat = async () => {
        try {
          const newChat = {
            agent: location.state.agent,
            category: location.state.category,
            color: location.state.color,
            title: `New Chat ${activeChats.length + 1}`,
            lastActive: Date.now(),
            messages: [],
          };

          // Create the chat in Firebase
          const createdChat = await addChat(newChat);
          console.log("Created chat:", createdChat); // Debug log

          // Update local state with the new chat
          setActiveChats((prev) => [createdChat, ...prev]);
          setSelectedChat(createdChat);

          // Navigate to the chat page
          navigate("/dashboard/chat", {
            state: {
              existingChat: true,
              id: createdChat.id,
              agent: createdChat.agent,
              category: createdChat.category,
              color: createdChat.color,
              title: createdChat.title,
              messages: createdChat.messages,
              lastActive: createdChat.lastActive,
            },
            replace: true,
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
                  <ChatItem chat={chat} isActive={location.pathname === "/dashboard/chat" && selectedChat?.id === chat.id} onClick={() => handleChatClick(chat)} />
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Profile Section */}
        <Box
          p={4}
          borderTop="1px"
          borderColor="whiteAlpha.100"
          bg="rgba(26, 32, 44, 0.4)"
          backdropFilter="blur(10px)"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: "25%",
            right: "25%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
          }}
        >
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
