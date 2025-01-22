import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Input, IconButton, VStack, HStack, Divider, useToast, SimpleGrid, Icon } from "@chakra-ui/react";
import { FaArrowUp, FaRobot } from "react-icons/fa";
import { useLocation, Navigate, useNavigate, useOutletContext } from "react-router-dom";
import { addMessage, addAgentResponse } from "../firebase/chatOperations";

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

const ChatMessage = ({ message, color }) => {
  const isAgent = message.role === "agent";

  // Function to create gradient from base color
  const createGradient = (color) => {
    const lighterColor = color + "20";
    const fadeColor = color + "10";
    return isAgent ? `linear-gradient(135deg, #1A202C, #2D3748)` : `linear-gradient(135deg, ${lighterColor}, ${fadeColor})`;
  };

  return (
    <Box
      maxW="80%"
      alignSelf={isAgent ? "flex-start" : "flex-end"}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: "-1px",
        left: "-1px",
        right: "-1px",
        bottom: "-1px",
        borderRadius: "xl",
        padding: "1px",
        background: isAgent ? "linear-gradient(125deg, whiteAlpha.100 -20%, transparent 60%)" : `linear-gradient(125deg, ${color} -20%, ${color}44 60%)`,
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
      }}
    >
      <Box
        p={4}
        borderRadius="lg"
        background={createGradient(color)}
        backdropFilter="blur(10px)"
        boxShadow={`0 4px 20px ${isAgent ? "rgba(0,0,0,0.2)" : color + "22"}`}
        border="1px solid"
        borderColor={isAgent ? "whiteAlpha.100" : `${color}22`}
        transition="all 0.2s"
        _hover={{
          transform: "translateY(-1px)",
          boxShadow: `0 6px 24px ${isAgent ? "rgba(0,0,0,0.3)" : color + "33"}`,
        }}
      >
        <Text whiteSpace="pre-wrap" style={{ overflowWrap: "break-word" }} color={isAgent ? "whiteAlpha.900" : "white"} textShadow={isAgent ? "none" : `0 0 20px ${color}44`} fontSize="md">
          {message.content}
        </Text>
        <HStack spacing={2} mt={2}>
          <Box w={2} h={2} borderRadius="full" bg={isAgent ? "whiteAlpha.400" : color} boxShadow={`0 0 10px ${isAgent ? "rgba(255,255,255,0.2)" : color}`} />
          <Text fontSize="xs" color={isAgent ? "whiteAlpha.600" : "whiteAlpha.800"}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

const ActiveChat = ({ chat, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const toast = useToast();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

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

  if (!chat || !chat.messages) {
    return null;
  }

  return (
    <Box height="100vh" position="relative" userSelect="none">
      {/* Header */}
      <Box
        p={6}
        bg="rgba(26, 32, 44, 0.8)"
        backdropFilter="blur(10px)"
        borderBottom="1px solid rgba(255, 255, 255, 0.1)"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, ${chat.color}11, transparent)`,
          pointerEvents: "none",
        }}
      >
        <Box position="absolute" top="-50%" right="-10%" width="400px" height="400px" background={`radial-gradient(circle, ${chat.color}11 0%, transparent 70%)`} opacity="0.5" pointerEvents="none" />

        <VStack align="stretch" spacing={3} position="relative">
          <HStack spacing={2}>
            <Text color="whiteAlpha.700" fontSize="sm" px={3} py={1} borderRadius="full" bg="whiteAlpha.100" backdropFilter="blur(5px)">
              {chat.category}
            </Text>
          </HStack>

          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Box p={2} borderRadius="lg" bg={`${chat.color}22`} border="1px solid" borderColor={`${chat.color}33`}>
                <Icon as={FaRobot} boxSize={6} color={chat.color} />
              </Box>
              <Text color="white" fontSize="2xl" fontWeight="bold" textShadow={`0 0 20px ${chat.color}44`}>
                {chat.agent.name}
              </Text>
            </HStack>
            <Flex gap={3}>
              {chat.agent.verifiedTag && (
                <Box bg="rgba(6, 182, 212, 0.1)" color="cyan.200" px={3} py={1.5} borderRadius="lg" fontSize="xs" fontWeight="bold" border="1px solid" borderColor="cyan.700" textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={2} backdropFilter="blur(5px)">
                  <Box as="span" w={2} h={2} borderRadius="full" bg="cyan.400" />
                  {chat.agent.verifiedTag}
                </Box>
              )}
              {chat.agent.specialTag && (
                <Box bg={`${chat.color}11`} color={chat.color} px={3} py={1.5} borderRadius="lg" fontSize="xs" fontWeight="bold" border="1px solid" borderColor={`${chat.color}44`} textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={2} backdropFilter="blur(5px)">
                  <Box as="span" w={2} h={2} borderRadius="full" bg={chat.color} />
                  {chat.agent.specialTag}
                </Box>
              )}
            </Flex>
          </Flex>

          <Text color="gray.400" fontSize="md" px={4} py={3} borderRadius="xl" bg="whiteAlpha.50" backdropFilter="blur(5px)" border="1px solid" borderColor="whiteAlpha.100">
            {chat.agent.description}
          </Text>
        </VStack>
      </Box>

      {/* Chat Area */}
      <Box flex="1" overflowY="auto" p={6} height="calc(100vh - 200px)" bg="#0f1117">
        <VStack align="stretch" spacing={4} maxW="900px" mx="auto">
          {chat.messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} color={chat.color} />
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        p={6}
        ml="250px"
        background="linear-gradient(to top, #0f1117 80%, transparent)"
        backdropFilter="blur(10px)"
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${chat.color}44, transparent)`,
        }}
      >
        <Flex gap={4} maxW="900px" mx="auto" position="relative">
          <Input
            placeholder="Type your message..."
            size="lg"
            bg="rgba(13, 16, 25, 0.7)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _placeholder={{ color: "whiteAlpha.500" }}
            _hover={{
              borderColor: `${chat.color}44`,
              boxShadow: `0 0 10px ${chat.color}22`,
            }}
            _focus={{
              borderColor: chat.color,
              boxShadow: `0 0 15px ${chat.color}33`,
              bg: "rgba(13, 16, 25, 0.9)",
            }}
            color="white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            userSelect="text"
            transition="all 0.2s"
            sx={{
              "&::-webkit-input-placeholder": {
                background: `linear-gradient(90deg, ${chat.color}77, whiteAlpha.500)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              },
            }}
          />
          <IconButton
            icon={<FaArrowUp />}
            size="lg"
            position="relative"
            color="white"
            bg={`${chat.color}22`}
            _hover={{
              bg: `${chat.color}33`,
              transform: "translateY(-2px)",
              _before: {
                opacity: 1,
              },
            }}
            _active={{
              transform: "translateY(0)",
            }}
            transition="all 0.2s"
            onClick={handleSendMessage}
            _before={{
              content: '""',
              position: "absolute",
              inset: "-1px",
              padding: "1px",
              borderRadius: "lg",
              background: `linear-gradient(135deg, ${chat.color}, transparent)`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              opacity: 0.5,
              transition: "opacity 0.2s",
            }}
            sx={{
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "lg",
                background: `radial-gradient(circle at center, ${chat.color}22, transparent)`,
                opacity: 0.5,
                filter: "blur(10px)",
              },
            }}
          />
        </Flex>
      </Box>
    </Box>
  );
};

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { activeChats, setActiveChats } = useOutletContext();
  const [currentChat, setCurrentChat] = useState(null);

  useEffect(() => {
    if (location.state) {
      setCurrentChat({
        ...location.state,
        messages: location.state.messages || [],
      });
    }
  }, [location.state]);

  if (!currentChat) {
    return <Navigate to="/dashboard/home" replace />;
  }

  const handleSendMessage = async (messageText) => {
    try {
      // Create user message
      const userMessage = {
        role: "user",
        content: messageText,
        timestamp: Date.now(),
      };

      // Add user message to Firebase
      await addMessage(currentChat.id, userMessage);

      // Update local state
      const updatedMessages = [...currentChat.messages, userMessage];
      const updatedChat = { ...currentChat, messages: updatedMessages };
      setCurrentChat(updatedChat);

      navigate(location.pathname, {
        state: updatedChat,
        replace: true,
      });

      // Simulate agent response
      const agentMessage = await addAgentResponse(currentChat.id, userMessage);

      // Update local state with agent response
      const finalMessages = [...updatedMessages, agentMessage];
      const finalChat = { ...currentChat, messages: finalMessages };
      setCurrentChat(finalChat);

      navigate(location.pathname, {
        state: finalChat,
        replace: true,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return <ActiveChat chat={currentChat} onSendMessage={handleSendMessage} />;
};

export default ChatPage;
