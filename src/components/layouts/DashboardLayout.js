import React, { useState, useEffect } from "react";
import { Box, Flex, VStack, Button, Text, HStack, Avatar, Icon, Input, InputGroup, InputLeftElement, Divider } from "@chakra-ui/react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineMessage, AiOutlineSearch } from "react-icons/ai";
import { FaHome, FaComments, FaCog, FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";
import { testChats } from "../../data/testChats";

const ChatItem = ({ chat, isActive, onClick }) => (
  <Box p={3} cursor="pointer" borderRadius="md" bg={isActive ? "whiteAlpha.100" : "transparent"} _hover={{ bg: "whiteAlpha.100" }} onClick={onClick} transition="all 0.2s">
    <VStack align="start" spacing={1}>
      <Flex justify="space-between" width="100%" align="center">
        <Text color="white" fontSize="sm" fontWeight="medium" noOfLines={1}>
          {chat.title}
        </Text>
        <Box w={2} h={2} borderRadius="full" bg={chat.color} />
      </Flex>
      <Text color="whiteAlpha.600" fontSize="xs" noOfLines={1}>
        {chat.agent.name}
      </Text>
    </VStack>
  </Box>
);

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const accentColor = "cyan.400";
  const hoverColor = "cyan.200";
  const [activeChats, setActiveChats] = useState(testChats);
  const [selectedChat, setSelectedChat] = useState(null);

  const navItems = [{ path: "home", label: "Home", icon: AiOutlineHome }];

  const isActive = (path) => location.pathname === path;

  const handleChatClick = (chat) => {
    // Update lastActive time for the clicked chat
    setActiveChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, lastActive: Date.now() } : c)));

    setSelectedChat(chat);
    navigate("/dashboard/chat", {
      state: {
        existingChat: true, // Flag to indicate this is an existing chat
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

  useEffect(() => {
    if (location.state?.agent && !location.state?.existingChat) {
      const newChat = {
        id: `chat_${Date.now()}`,
        agent: location.state.agent,
        category: location.state.category,
        color: location.state.color,
        messages: [],
        lastActive: Date.now(),
        title: `New Chat ${activeChats.length + 1}`,
      };

      setActiveChats((prev) => [...prev, newChat].sort((a, b) => b.lastActive - a.lastActive));
      setSelectedChat(newChat);
      navigate("/dashboard/chat", { replace: true });
    }
  }, [location.state]);

  return (
    <Flex h="100vh" bg="#0f1117" userSelect="none">
      {/* Sidebar */}
      <Box w="250px" bg="#1a1d27" borderRight="1px" borderColor="whiteAlpha.100" display="flex" flexDirection="column">
        <Box flex="1" p={5} display="flex" flexDirection="column">
          {/* Logo/Header */}
          <HStack spacing={1} pb={4} borderBottom="1px" borderColor="whiteAlpha.100" justify="center">
            <Text fontSize="2xl" fontWeight="700" letterSpacing="wider" color="white" textShadow="0 0 10px rgba(255,255,255,0.2)">
              BRIDGE
            </Text>
            <Text fontSize="2xl" fontWeight="400" letterSpacing="wider" color="whiteAlpha.800">
              AI
            </Text>
          </HStack>

          {/* Navigation */}
          <VStack spacing={2} align="stretch" mt={8}>
            {navItems.map((item) => {
              const isItemActive = location.pathname === `/dashboard/${item.path}`;
              return (
                <Button
                  key={item.path}
                  variant={isItemActive ? "solid" : "ghost"}
                  bg={isItemActive ? "#2d303a" : "transparent"}
                  color={isItemActive ? accentColor : "white"}
                  justifyContent="flex-start"
                  size="lg"
                  onClick={() => navigate(`/dashboard/${item.path}`)}
                  leftIcon={<Icon as={item.icon} color={isItemActive ? accentColor : "white"} fontSize="20px" transition="all 0.2s" _groupHover={{ color: hoverColor }} />}
                  _hover={{
                    bg: "#2d303a",
                    color: hoverColor,
                  }}
                  role="group"
                  transition="all 0.2s"
                >
                  {item.label}
                </Button>
              );
            })}
          </VStack>

          {/* Active Chats Section */}
          <Box mt={8}>
            <Text color="whiteAlpha.600" fontSize="sm" fontWeight="medium" mb={3} px={3}>
              ACTIVE CHATS
            </Text>
            <Box
              maxH="calc(100vh - 400px)"
              overflowY="auto"
              sx={{
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "whiteAlpha.300",
                  borderRadius: "24px",
                },
              }}
            >
              {activeChats.length === 0 ? (
                <VStack spacing={4} p={4} textAlign="center">
                  <Icon as={FaRobot} w={6} h={6} color="whiteAlpha.400" />
                  <Text color="whiteAlpha.600" fontSize="sm">
                    No active chats
                  </Text>
                </VStack>
              ) : (
                <VStack spacing={1} align="stretch">
                  {activeChats
                    .sort((a, b) => b.lastActive - a.lastActive)
                    .map((chat) => (
                      <ChatItem key={chat.id} chat={chat} isActive={location.pathname === "/dashboard/chat" && selectedChat?.id === chat.id} onClick={() => handleChatClick(chat)} />
                    ))}
                </VStack>
              )}
            </Box>
          </Box>
        </Box>

        {/* Profile Section */}
        <Box p={4} borderTop="1px" borderColor="whiteAlpha.100">
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
      <Box flex={1} bg="#0f1117">
        <Box flex={1}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
