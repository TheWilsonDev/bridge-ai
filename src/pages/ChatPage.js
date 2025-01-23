import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Input, IconButton, VStack, HStack, Divider, useToast, SimpleGrid, Icon, Spinner } from "@chakra-ui/react";
import { FaArrowUp, FaRobot, FaArrowDown } from "react-icons/fa";
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

const LoadingAnimation = ({ color }) => (
  <Box position="relative" height="24px" display="flex" alignItems="center">
    <Text color={color} fontSize="md">
      Loading
      <Box
        as="span"
        sx={{
          "@keyframes dots": {
            "0%": { content: "''" },
            "25%": { content: "'.'" },
            "50%": { content: "'..'" },
            "75%": { content: "'...'" },
            "100%": { content: "''" },
          },
          "&::after": {
            content: "''",
            animation: "dots 2s infinite",
          },
        }}
      />
    </Text>
  </Box>
);

const TypewriterText = ({ text, color }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const TOTAL_ANIMATION_TIME = 3000;
      const characterDelay = TOTAL_ANIMATION_TIME / text.length;

      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, characterDelay);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setShowCursor(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <Box position="relative">
      <Text whiteSpace="pre-wrap" style={{ overflowWrap: "break-word" }} color="inherit" textShadow="inherit" fontSize="md">
        {displayedText}
        {showCursor && (
          <Box
            as="span"
            animation="blink 1s infinite"
            sx={{
              "@keyframes blink": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0 },
              },
              background: `linear-gradient(to right, ${color}, ${color}66)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ▌
          </Box>
        )}
      </Text>
      <Box
        position="absolute"
        bottom="-2px"
        left="0"
        height="1px"
        background={color}
        sx={{
          width: `${(currentIndex / text.length) * 100}%`,
          transition: "width 0.03s linear",
          boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
        }}
      />
    </Box>
  );
};

const ChatMessage = ({ message, color, onTypingComplete }) => {
  const isAgent = message.role === "agent";
  const isLoading = message.isLoading;

  useEffect(() => {
    if (isLoading === false && onTypingComplete) {
      onTypingComplete();
    }
  }, [isLoading, onTypingComplete]);

  const createGradient = (color) => {
    return isAgent ? `linear-gradient(135deg, #1A202C, #2D3748)` : `linear-gradient(135deg, ${color}20, ${color}10)`;
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
        _hover={
          isAgent
            ? {
                transform: "translateY(-1px)",
                boxShadow: `0 6px 24px rgba(0,0,0,0.3)`,
              }
            : undefined
        }
      >
        {isLoading ? (
          <LoadingAnimation color={isAgent ? "whiteAlpha.800" : color} />
        ) : (
          <Text whiteSpace="pre-wrap" style={{ overflowWrap: "break-word", userSelect: "text" }} color={isAgent ? "whiteAlpha.900" : "inherit"} textShadow="inherit" fontSize="md">
            {message.content}
          </Text>
        )}
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
  const [messageText, setMessageText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setUserScrolled(false);
  };

  // Handle user scroll
  const handleScroll = (e) => {
    const element = e.target;
    const isScrolledToBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50;
    setUserScrolled(!isScrolledToBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, isGenerating]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setIsGenerating(true);
    setUserScrolled(false);
    onSendMessage(messageText);
    setMessageText("");
  };

  if (!chat) return null;

  return (
    <Flex direction="column" h="100vh" position="relative">
      {/* Header */}
      <Box
        w="100%"
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

        {/* Header Content Container */}
        <Box p={6} w="100%">
          <VStack align="stretch" spacing={3} position="relative" width="100%">
            <HStack spacing={2} width="100%">
              <Text color="whiteAlpha.700" fontSize="sm" px={3} py={1} borderRadius="full" bg="whiteAlpha.100" backdropFilter="blur(5px)">
                {chat.category}
              </Text>
            </HStack>

            <Flex justify="space-between" align="center" width="100%">
              <HStack spacing={4} flex={1}>
                <Box p={2} borderRadius="lg" bg={`${chat.color}22`} border="1px solid" borderColor={`${chat.color}33`}>
                  <Icon as={FaRobot} boxSize={6} color={chat.color} />
                </Box>
                <Text color="white" fontSize="2xl" fontWeight="bold" textShadow={`0 0 20px ${chat.color}44`}>
                  {chat.agent.name} - {chat.title}
                </Text>
              </HStack>
              <HStack gap={2} flex={0}>
                {chat.agent.verifiedTag && (
                  <Box bg="rgba(6, 182, 212, 0.1)" color="cyan.200" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold" border="1px solid" borderColor="cyan.700" textTransform="uppercase" letterSpacing="wider" display="inline-flex" alignItems="center" gap={1.5} backdropFilter="blur(5px)" h="auto" whiteSpace="nowrap">
                    <Box as="span" w={1.5} h={1.5} borderRadius="full" bg="cyan.400" />
                    {chat.agent.verifiedTag}
                  </Box>
                )}
                {chat.agent.specialTag && (
                  <Box bg={`${chat.color}11`} color={chat.color} px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold" border="1px solid" borderColor={`${chat.color}44`} textTransform="uppercase" letterSpacing="wider" display="inline-flex" alignItems="center" gap={1.5} backdropFilter="blur(5px)" h="auto" whiteSpace="nowrap">
                    <Box as="span" w={1.5} h={1.5} borderRadius="full" bg={chat.color} />
                    {chat.agent.specialTag}
                  </Box>
                )}
              </HStack>
            </Flex>

            <Text width="100%" color="gray.400" fontSize="md" px={4} py={3} borderRadius="xl" bg="whiteAlpha.50" backdropFilter="blur(5px)" border="1px solid" borderColor="whiteAlpha.100" style={{ userSelect: "text" }}>
              {chat.agent.description}
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Messages area with padding at bottom to prevent clipping */}
      <VStack
        ref={messagesContainerRef}
        flex="1"
        w="100%"
        maxW="900px"
        mx="auto"
        spacing={4}
        overflowY="auto"
        p={4}
        pb="100px"
        onScroll={handleScroll}
        css={{
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
          },
        }}
      >
        {chat.messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            color={chat.color}
            onTypingComplete={() => {
              if (index === chat.messages.length - 1) {
                setIsGenerating(false);
              }
            }}
          />
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      {/* Scroll to bottom button */}
      {userScrolled && (
        <Box position="absolute" bottom="120px" left="50%" transform="translateX(-50%)" zIndex={2}>
          <IconButton
            icon={<FaArrowDown />}
            aria-label="Scroll to bottom"
            onClick={scrollToBottom}
            size="md"
            rounded="full"
            color="white"
            bg="rgba(26, 32, 44, 0.8)"
            _hover={{
              bg: "rgba(26, 32, 44, 0.9)",
              transform: "translateY(-2px)",
            }}
            _active={{
              transform: "translateY(0)",
            }}
            transition="all 0.2s"
            boxShadow="lg"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _before={{
              content: '""',
              position: "absolute",
              inset: "-1px",
              padding: "1px",
              borderRadius: "full",
              background: `linear-gradient(135deg, ${chat.color}, transparent)`,
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              opacity: 0.5,
            }}
          />
        </Box>
      )}

      {/* Input area fixed at bottom */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={6}
        bg="rgba(26, 32, 44, 0.7)"
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
        <form onSubmit={handleSubmit}>
          <Flex gap={4} maxW="900px" mx="auto" position="relative">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type message here..."
              size="lg"
              bg="rgba(13, 16, 25, 0.28)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              _placeholder={{
                color: "whiteAlpha.500",
                opacity: 1,
              }}
              _hover={{
                borderColor: `${chat.color}44`,
                boxShadow: `0 0 10px ${chat.color}22`,
              }}
              _focus={{
                borderColor: chat.color,
                boxShadow: `0 0 15px ${chat.color}33`,
                bg: "rgba(13, 16, 25, 0.36)",
              }}
              color="white"
              transition="all 0.2s"
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
              type="submit"
              isDisabled={!messageText.trim()}
              _before={{
                content: '""',
                position: "absolute",
                inset: "-1px",
                padding: "1px",
                borderRadius: "lg",
                background: `linear-gradient(135deg, ${chat.color}, transparent)`,
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
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
        </form>
      </Box>
    </Flex>
  );
};

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { activeChats, setActiveChats } = useOutletContext();
  const [currentChat, setCurrentChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("ChatPage: Location changed", location);
    setIsLoading(true);

    // Try to get chat from location state first, then fallback to sessionStorage
    const chatState = location.state || JSON.parse(sessionStorage.getItem("currentChat"));
    console.log("ChatPage: Retrieved chatState", chatState);

    if (chatState) {
      console.log("ChatPage: Setting current chat");
      setCurrentChat({
        ...chatState,
        messages: chatState.messages || [],
      });
    } else {
      console.log("ChatPage: No chat state found");
    }
    setIsLoading(false);
  }, [location.state]);

  // Add effect to listen for chat updates
  useEffect(() => {
    if (currentChat && activeChats) {
      const updatedChat = activeChats.find((chat) => chat.id === currentChat.id);
      if (updatedChat) {
        setCurrentChat((prev) => ({
          ...prev,
          title: updatedChat.title,
          agent: updatedChat.agent,
          category: updatedChat.category,
          color: updatedChat.color,
        }));
        // Update session storage
        sessionStorage.setItem(
          "currentChat",
          JSON.stringify({
            ...currentChat,
            title: updatedChat.title,
            agent: updatedChat.agent,
            category: updatedChat.category,
            color: updatedChat.color,
          })
        );
      }
    }
  }, [activeChats, currentChat?.id]);

  console.log("ChatPage: Current chat state:", currentChat, "isLoading:", isLoading);

  if (!currentChat && !isLoading) {
    console.log("ChatPage: No current chat and not loading, redirecting to home");
    return <Navigate to="/dashboard/home" replace />;
  }

  if (isLoading || !currentChat) {
    return (
      <Box p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  const handleSendMessage = async (messageText) => {
    try {
      console.log("ChatPage: Sending message", messageText);
      // Create user message
      const userMessage = {
        role: "user",
        content: messageText,
        timestamp: Date.now(),
        isNewMessage: true, // Add this flag for new messages
      };

      // Add user message to Firebase
      await addMessage(currentChat.id, userMessage);
      console.log("ChatPage: Message added to Firebase");

      // Update local state with user message
      const updatedMessages = [...currentChat.messages, userMessage];
      const updatedChat = { ...currentChat, messages: updatedMessages };
      setCurrentChat(updatedChat);
      console.log("ChatPage: Local state updated with user message");

      // Update sessionStorage
      sessionStorage.setItem("currentChat", JSON.stringify(updatedChat));
      console.log("ChatPage: Session storage updated");

      try {
        // Add loading message to local state
        const loadingMessage = {
          role: "agent",
          content: "...",
          timestamp: Date.now(),
          isLoading: true,
        };

        // Update state with loading message
        const chatWithLoading = {
          ...updatedChat,
          messages: [...updatedMessages, loadingMessage],
        };
        setCurrentChat(chatWithLoading);

        // Get AI response
        const agentMessage = {
          ...(await addAgentResponse(currentChat.id, userMessage)),
          isNewMessage: true, // Add this flag for new AI responses
        };
        console.log("ChatPage: Agent response received", agentMessage);

        // Replace loading message with actual response
        const finalMessages = updatedMessages.concat(agentMessage);
        const finalChat = { ...currentChat, messages: finalMessages };
        setCurrentChat(finalChat);
        console.log("ChatPage: Local state updated with agent response");

        // Update sessionStorage
        sessionStorage.setItem("currentChat", JSON.stringify(finalChat));
        console.log("ChatPage: Session storage updated with agent response");

        navigate(location.pathname, {
          state: finalChat,
        });
      } catch (error) {
        // Remove loading message and show error
        setCurrentChat(updatedChat); // Revert to state without loading message
        console.error("ChatPage: Error getting AI response:", error);
        toast({
          title: "AI Response Error",
          description: error.message || "Failed to get AI response. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("ChatPage: Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Failed to send your message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return <ActiveChat chat={currentChat} onSendMessage={handleSendMessage} />;
};

export default ChatPage;
