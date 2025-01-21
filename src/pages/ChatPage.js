import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Input, IconButton, VStack, HStack, Divider, useToast, SimpleGrid, Icon } from "@chakra-ui/react";
import { FaArrowUp, FaRobot } from "react-icons/fa";
import { useLocation, Navigate, useNavigate } from "react-router-dom";

const ChatCard = ({ chat, onClick, isActive }) => {
  return (
    <Box
      bg="#1A202C"
      p={4}
      borderRadius="md"
      cursor="pointer"
      transition="all 0.2s"
      borderWidth="1px"
      borderColor={isActive ? chat.color : "transparent"}
      onClick={onClick}
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "md",
        borderColor: chat.color,
      }}
    >
      <VStack align="start" spacing={2}>
        <Flex align="center" width="100%" justify="space-between" gap={2}>
          <Text color="white" fontSize="lg" fontWeight="semibold">
            {chat.agent.name}
          </Text>
          <Flex gap={2}>
            {chat.agent.verifiedTag && (
              <Box bg="cyan.900" color="cyan.200" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor="cyan.700" textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={1}>
                <Box as="span" w={2} h={2} borderRadius="full" bg="cyan.400" />
                {chat.agent.verifiedTag}
              </Box>
            )}
          </Flex>
        </Flex>
        <Text color="gray.400" fontSize="sm">
          {chat.category}
        </Text>
      </VStack>
    </Box>
  );
};

const ActiveChat = ({ chat, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const toast = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Message cannot be empty",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    onSendMessage(message);
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box height="100vh" position="relative" userSelect="none">
      {/* Header */}
      <Box p={6} bg="#1A202C" borderBottom="1px solid" borderColor="whiteAlpha.200">
        <VStack align="stretch" spacing={2}>
          <Text color="whiteAlpha.700" fontSize="sm">
            {chat.category}
          </Text>
          <Flex justify="space-between" align="center">
            <Text color="white" fontSize="2xl" fontWeight="bold">
              {chat.agent.name}
            </Text>
            <Flex gap={2}>
              {chat.agent.verifiedTag && (
                <Box bg="cyan.900" color="cyan.200" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor="cyan.700" textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={1}>
                  <Box as="span" w={2} h={2} borderRadius="full" bg="cyan.400" />
                  {chat.agent.verifiedTag}
                </Box>
              )}
              {chat.agent.specialTag && (
                <Box bg={`${chat.color}22`} color={chat.color} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor={`${chat.color}44`} textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={1}>
                  <Box as="span" w={2} h={2} borderRadius="full" bg={chat.color} />
                  {chat.agent.specialTag}
                </Box>
              )}
            </Flex>
          </Flex>
          <Text color="gray.400" fontSize="md">
            {chat.agent.description}
          </Text>
        </VStack>
      </Box>

      {/* Chat Area */}
      <Box flex="1" overflowY="auto" p={6} height="calc(100vh - 200px)">
        {/* Chat messages will go here */}
      </Box>

      {/* Input Area */}
      <Box position="fixed" bottom={0} left={0} right={0} p={6} ml="250px">
        <Flex gap={4} maxW="900px" mx="auto">
          <Input
            placeholder="Type your message..."
            size="lg"
            bg="transparent"
            border="1px solid"
            borderColor="whiteAlpha.300"
            _placeholder={{ color: "whiteAlpha.500" }}
            _hover={{
              borderColor: "whiteAlpha.400",
            }}
            _focus={{
              borderColor: chat.color,
              boxShadow: `0 0 0 1px ${chat.color}`,
              bg: "rgba(20, 24, 33, 0.5)",
            }}
            color="white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            userSelect="text"
          />
          <IconButton
            icon={<FaArrowUp />}
            size="lg"
            colorScheme="blue"
            bg={chat.color}
            _hover={{
              bg: chat.color,
              opacity: 0.9,
            }}
            onClick={handleSendMessage}
          />
        </Flex>
      </Box>
    </Box>
  );
};

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("activeChats");
    if (savedChats) {
      setActiveChats(JSON.parse(savedChats));
    }
  }, []);

  // Save chats to localStorage when they change
  useEffect(() => {
    localStorage.setItem("activeChats", JSON.stringify(activeChats));
  }, [activeChats]);

  // Handle new chat creation from agent selection
  useEffect(() => {
    if (location.state?.agent) {
      const newChat = {
        id: Date.now(),
        agent: location.state.agent,
        category: location.state.category,
        color: location.state.color,
        messages: [],
      };

      setActiveChats((prev) => {
        // Check if chat with same agent already exists
        const exists = prev.some((chat) => chat.agent.name === newChat.agent.name);
        if (!exists) {
          return [...prev, newChat];
        }
        return prev;
      });

      setSelectedChat(newChat);
      // Clear location state
      navigate("/dashboard/chat", { replace: true });
    }
  }, [location.state]);

  const handleSendMessage = (message) => {
    if (selectedChat) {
      setActiveChats((prev) =>
        prev.map((chat) => {
          if (chat.id === selectedChat.id) {
            return {
              ...chat,
              messages: [...chat.messages, { text: message, sender: "user", timestamp: Date.now() }],
            };
          }
          return chat;
        })
      );
    }
  };

  // If no chats, show empty state
  if (activeChats.length === 0) {
    return (
      <Box height="100%" display="flex" alignItems="center" justifyContent="center" userSelect="none">
        <VStack spacing={4} p={8} textAlign="center">
          <Icon as={FaRobot} w={12} h={12} color="whiteAlpha.400" />
          <Text color="white" fontSize="2xl" fontWeight="bold">
            No Active Chats
          </Text>
          <Text color="whiteAlpha.600">Select a tutor from the home page to start a new chat</Text>
        </VStack>
      </Box>
    );
  }

  // If no chat is selected, show the chat list
  if (!selectedChat) {
    return (
      <Box p={8} userSelect="none">
        <Text color="white" fontSize="2xl" fontWeight="bold" mb={6}>
          Your Chats
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {activeChats.map((chat) => (
            <ChatCard key={chat.id} chat={chat} onClick={() => setSelectedChat(chat)} isActive={selectedChat?.id === chat.id} />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  // Show active chat
  return <ActiveChat chat={selectedChat} onSendMessage={handleSendMessage} />;
};

export default ChatPage;
