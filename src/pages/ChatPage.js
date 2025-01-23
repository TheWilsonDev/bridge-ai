import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Text, Input, IconButton, VStack, HStack, Divider, useToast, SimpleGrid, Icon, Spinner, Button } from "@chakra-ui/react";
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
  const [chatMessageText, setChatMessageText] = useState("");
  const [agentMessageText, setAgentMessageText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("setup");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const toast = useToast();
  const [completedTasks, setCompletedTasks] = useState([
    {
      id: 1,
      phase: "setup",
      task: "Topic Selection",
      description: "Selected topic: The Impact of Artificial Intelligence on Modern Healthcare",
      status: "completed",
    },
    {
      id: 3,
      phase: "setup",
      task: "Essay Type",
      description: "Selected type: Argumentative Essay",
      status: "completed",
    },
    {
      id: 4,
      phase: "setup",
      task: "Requirements",
      description: "Word count: 2000 words\nFormat: APA Style\nAudience: Academic",
      status: "completed",
    },
    {
      id: 5,
      phase: "setup",
      task: "Additional Requirements",
      description: "Include at least 5 peer-reviewed sources\nMust be written in third person\nInclude counter-arguments",
      status: "completed",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setUserScrolled(false);
  };

  const handleScroll = (e) => {
    const element = e.target;
    const isScrolledToBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50;
    setUserScrolled(!isScrolledToBottom);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, isGenerating]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatMessageText.trim()) return;
    setIsGenerating(true);
    setUserScrolled(false);
    onSendMessage(chatMessageText);
    setChatMessageText("");
  };

  const handleAgentSubmit = async (e) => {
      e.preventDefault();
    if (!agentMessageText.trim()) return;

    // Get the current active task
    const currentActiveTask = {
      id: Date.now(),
      phase: currentPhase,
      task: (() => {
        switch (currentPhase) {
          case "setup":
            return "Initial Setup";
          case "research":
            return "Research Sources";
          case "outline":
            return "Create Basic Outline";
          case "expand":
            return "Expand Outline";
          case "review":
            return "Final Review";
          case "convert":
            return "Convert to Essay";
          default:
            return "Initial Setup";
        }
      })(),
      description: agentMessageText,
      status: "completed",
    };

    // Add the current task to completed tasks with a fade-out animation
    setCompletedTasks((prev) => [currentActiveTask, ...prev]);

    // Clear the input and update state
    setAgentMessageText("");
    setIsGenerating(true);
    setUserScrolled(false);

    // Send the message
    onSendMessage(agentMessageText);
  };

  const handlePhaseChange = (phaseId) => {
    setCurrentPhase(phaseId);
  };

  // Add animation styles to the task boxes
  const taskBoxStyles = (status) => ({
    opacity: status === "active" ? 1 : 0.8,
    transform: "translateY(0)",
    transition: "all 0.3s ease-in-out",
    _hover: {
      opacity: 1,
      transform: status === "active" ? "translateY(-2px)" : "none",
    },
  });

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

      {/* Split View Container */}
      <Flex flex="1" w="100%" position="relative" overflow="hidden">
        {/* Left Side - Chat History */}
        <Box position="relative" w="50%" h="100%">
          <VStack
            ref={messagesContainerRef}
            flex="1"
            w="100%"
            spacing={4}
            overflowY="auto"
            p={4}
            pb="100px"
            onScroll={handleScroll}
            borderRight="1px solid"
            borderColor="whiteAlpha.100"
            h="100%"
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

          {/* Bottom Input Area */}
      <Box
            position="absolute"
        bottom={0}
        left={0}
        right={0}
            p={4}
            bg="rgba(26, 32, 44, 0.7)"
        backdropFilter="blur(10px)"
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
            zIndex={1}
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
            <form onSubmit={handleChatSubmit}>
              <Flex gap={4} position="relative">
          <Input
                  value={chatMessageText}
                  onChange={(e) => setChatMessageText(e.target.value)}
                  placeholder="Type custom message here..."
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
                  isDisabled={!chatMessageText.trim()}
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
    </Box>

        {/* Right Side - Agent Interaction */}
        <VStack flex="1" w="50%" p={4} spacing={6} h="100%" overflowY="hidden">
          {/* Task Manager Selector */}
          <HStack
            w="100%"
            spacing={2}
            overflowX="auto"
            pb={2}
            css={{
              "&::-webkit-scrollbar": {
                height: "2px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "2px",
              },
            }}
          >
            {[
              { id: "setup", name: "Initial Setup", icon: "🎯" },
              { id: "research", name: "Research", icon: "🔍" },
              { id: "outline", name: "Basic Outline", icon: "📝" },
              { id: "expand", name: "Expand Outline", icon: "📋" },
              { id: "review", name: "Final Review", icon: "✅" },
              { id: "convert", name: "Convert to Essay", icon: "📄" },
            ].map((phase) => (
              <Button
                key={phase.id}
                size="sm"
                px={4}
                py={2}
                color="whiteAlpha.900"
                bg={phase.id === currentPhase ? `${chat.color}22` : "rgba(255, 255, 255, 0.03)"}
                backdropFilter="blur(8px)"
                border="1px solid"
                borderColor={phase.id === currentPhase ? chat.color : "whiteAlpha.100"}
                onClick={() => handlePhaseChange(phase.id)}
                _hover={{
                  bg: "rgba(255, 255, 255, 0.08)",
                  borderColor: chat.color,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${chat.color}22`,
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                transition="all 0.2s"
                whiteSpace="nowrap"
                leftIcon={<Text fontSize="lg">{phase.icon}</Text>}
              >
                {phase.name}
              </Button>
            ))}
          </HStack>

          {/* Tasks Container */}
          <VStack w="100%" spacing={6} align="stretch">
            {/* Active Task - Fixed */}
            {[
              {
                id: 2,
                phase: currentPhase,
                task: (() => {
                  switch (currentPhase) {
                    case "setup":
                      return "Initial Setup";
                    case "research":
                      return "Research Sources";
                    case "outline":
                      return "Create Basic Outline";
                    case "expand":
                      return "Expand Outline";
                    case "review":
                      return "Final Review";
                    case "convert":
                      return "Convert to Essay";
                    default:
                      return "Initial Setup";
                  }
                })(),
                description: (() => {
                  switch (currentPhase) {
                    case "setup":
                      return "Hi! I'm your Essay Writer Pro Bot. Let's get started. What topic would you like to write about?";
                    case "research":
                      return "Would you like me to search the internet for sources to help with your essay? I can find credible sources related to your topic.";
                    case "outline":
                      return "Let's create a basic outline for your essay. We'll start with the main sections: Introduction, Body Paragraphs, and Conclusion.";
                    case "expand":
                      return "Now let's expand each section of your outline. Which section would you like to work on first?";
                    case "review":
                      return "Let's review your fully expanded outline. We can make any final adjustments before moving to the next step.";
                    case "convert":
                      return "Your outline is complete! Would you like me to help you convert it into a full essay draft?";
                    default:
                      return "Hi! I'm your Essay Writer Pro Bot. Let's get started. What topic would you like to write about?";
                  }
                })(),
                status: "active",
              },
            ].map((taskData) => (
              <Box
                key={taskData.id}
                w="100%"
                p={6}
                borderRadius="xl"
                {...taskBoxStyles("active")}
                sx={{
                  "@keyframes fadeIn": {
                    "0%": { opacity: 0, transform: "translateY(-10px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                  },
                  animation: "fadeIn 0.3s ease-in-out",
                }}
              >
                <Box position="absolute" top="-50%" right="-10%" width="400px" height="400px" background={`radial-gradient(circle, ${taskData.status === "active" ? `${chat.color}11` : "whiteAlpha.100"} 0%, transparent 70%)`} opacity="0.5" pointerEvents="none" zIndex={0} />
                <VStack spacing={6} position="relative" zIndex={1}>
                  <Box p={4} w="100%" borderRadius="xl" bg="rgba(255, 255, 255, 0.03)" backdropFilter="blur(16px)" border="1px solid" borderColor="whiteAlpha.100">
                    <HStack mb={4} justify="space-between">
                      <HStack>
                        <Text color="white" fontSize="lg">
                          Task:
                        </Text>
                        <Text color={chat.color} fontSize="lg" fontWeight="bold">
                          {taskData.task}
                        </Text>
                        {taskData.status === "completed" && (
                          <Button
                            size="xs"
                            variant="ghost"
                            color={chat.color}
                            leftIcon={<FaArrowUp />}
                            ml={2}
                            _hover={{
                              bg: `${chat.color}11`,
                              transform: "translateY(-1px)",
                            }}
                            _active={{
                              transform: "translateY(0)",
                            }}
                            onClick={() => {
                              // Logic to scroll to message will be implemented
                              toast({
                                title: "Jump to Message",
                                description: `Jumping to ${taskData.task} message`,
                                status: "info",
                                duration: 2000,
                                isClosable: true,
                                position: "top-right",
                              });
                            }}
                          >
                            Jump to Message
                          </Button>
                        )}
                      </HStack>
                      <Text fontSize="xs" px={2} py={1} borderRadius="full" bg={taskData.status === "completed" ? "green.900" : taskData.status === "active" ? `${chat.color}22` : "gray.700"} color={taskData.status === "completed" ? "green.200" : taskData.status === "active" ? chat.color : "gray.300"}>
                        {taskData.status.toUpperCase()}
                      </Text>
                    </HStack>
                    <Text color="whiteAlpha.800">{taskData.description}</Text>
                  </Box>

                  {taskData.status === "active" && (
                    <>
                      {/* Recommended Options */}
                      <HStack
                        spacing={2}
                        w="100%"
                        overflowX="auto"
                        css={{
                          "&::-webkit-scrollbar": {
                            height: "2px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "transparent",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "rgba(255, 255, 255, 0.1)",
                            borderRadius: "2px",
                          },
                        }}
                      >
                        {(taskData.phase === "setup" ? ["Argumentative Essay", "Persuasive Essay", "Descriptive Essay", "Expository Essay", "Narrative Essay"] : taskData.phase === "research" ? ["Find Sources", "Add Own Source", "Skip Research", "View Sources"] : taskData.phase === "outline" ? ["Introduction", "Body Paragraphs", "Conclusion", "Add Section"] : taskData.phase === "expand" ? ["Expand Introduction", "Expand Body", "Expand Conclusion", "Add Details"] : taskData.phase === "review" ? ["Review Structure", "Review Content", "Review Style", "Make Changes"] : ["Generate Draft", "Download Outline", "Edit Draft", "Final Review"]).map((option, index) => (
                          <Button
                            key={index}
                            size="sm"
                            px={4}
                            py={2}
                            color="whiteAlpha.900"
                            bg="rgba(255, 255, 255, 0.03)"
                            backdropFilter="blur(8px)"
                            border="1px solid"
                            borderColor="whiteAlpha.100"
                            _hover={{
                              bg: "rgba(255, 255, 255, 0.08)",
                              borderColor: chat.color,
                              transform: "translateY(-1px)",
                              boxShadow: `0 4px 12px ${chat.color}22`,
                            }}
                            _active={{
                              transform: "translateY(0)",
                            }}
                            transition="all 0.2s"
                            whiteSpace="nowrap"
                          >
                            {option}
                          </Button>
                        ))}
                      </HStack>

                      {/* Input Area */}
                      <Box w="100%">
                        <form onSubmit={handleAgentSubmit}>
                          <VStack spacing={4} w="100%">
                            <Input
                              value={agentMessageText}
                              onChange={(e) => setAgentMessageText(e.target.value)}
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
                            <Button
                              w="100%"
                              size="lg"
                              bg={`${chat.color}22`}
                              color="white"
                              _hover={{
                                bg: `${chat.color}33`,
                                transform: "translateY(-2px)",
                              }}
                              _active={{
                                transform: "translateY(0)",
                              }}
                              transition="all 0.2s"
                              type="submit"
                              isDisabled={!agentMessageText.trim()}
                              leftIcon={<FaArrowUp />}
                            >
                              Send Message
                            </Button>
                          </VStack>
                        </form>
                      </Box>
                    </>
                  )}
                </VStack>
              </Box>
            ))}
            {/* Completed Tasks - Scrollable */}
            <Box
              maxH="calc(100vh - 500px)"
              overflowY="auto"
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
              <VStack spacing={4} align="stretch">
                {completedTasks.map((taskData, index) => (
                  <Box
                    key={taskData.id}
                    w="100%"
                    p={6}
                    borderRadius="xl"
                    {...taskBoxStyles("completed")}
                    sx={{
                      "@keyframes slideIn": {
                        "0%": { opacity: 0, transform: "translateY(-20px)" },
                        "100%": { opacity: 0.8, transform: "translateY(0)" },
                      },
                      animation: index === 0 ? "slideIn 0.3s ease-in-out" : "none",
                    }}
                  >
                    <Box position="absolute" top="-50%" right="-10%" width="400px" height="400px" background={`radial-gradient(circle, ${taskData.status === "active" ? `${chat.color}11` : "whiteAlpha.100"} 0%, transparent 70%)`} opacity="0.5" pointerEvents="none" zIndex={0} />
                    <VStack spacing={6} position="relative" zIndex={1}>
                      <Box p={4} w="100%" borderRadius="xl" bg="rgba(255, 255, 255, 0.03)" backdropFilter="blur(16px)" border="1px solid" borderColor="whiteAlpha.100">
                        <HStack mb={4} justify="space-between">
                          <HStack>
                            <Text color="white" fontSize="lg">
                              Task:
                            </Text>
                            <Text color={chat.color} fontSize="lg" fontWeight="bold">
                              {taskData.task}
                            </Text>
                            {taskData.status === "completed" && (
                              <Button
                                size="xs"
                                variant="ghost"
                                color={chat.color}
                                leftIcon={<FaArrowUp />}
                                ml={2}
                                _hover={{
                                  bg: `${chat.color}11`,
                                  transform: "translateY(-1px)",
                                }}
                                _active={{
                                  transform: "translateY(0)",
                                }}
                                onClick={() => {
                                  // Logic to scroll to message will be implemented
                                  toast({
                                    title: "Jump to Message",
                                    description: `Jumping to ${taskData.task} message`,
                                    status: "info",
                                    duration: 2000,
                                    isClosable: true,
                                    position: "top-right",
                                  });
                                }}
                              >
                                Jump to Message
                              </Button>
                            )}
                          </HStack>
                          <Text fontSize="xs" px={2} py={1} borderRadius="full" bg={taskData.status === "completed" ? "green.900" : taskData.status === "active" ? `${chat.color}22` : "gray.700"} color={taskData.status === "completed" ? "green.200" : taskData.status === "active" ? chat.color : "gray.300"}>
                            {taskData.status.toUpperCase()}
                          </Text>
                        </HStack>
                        <Text color="whiteAlpha.800">{taskData.description}</Text>
                      </Box>

                      {taskData.status === "active" && (
                        <>
                          {/* Recommended Options */}
                          <HStack
                            spacing={2}
                            w="100%"
                            overflowX="auto"
                            css={{
                              "&::-webkit-scrollbar": {
                                height: "2px",
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "transparent",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "2px",
                              },
                            }}
                          >
                            {(taskData.phase === "setup" ? ["Argumentative Essay", "Persuasive Essay", "Descriptive Essay", "Expository Essay", "Narrative Essay"] : taskData.phase === "research" ? ["Find Sources", "Add Own Source", "Skip Research", "View Sources"] : taskData.phase === "outline" ? ["Introduction", "Body Paragraphs", "Conclusion", "Add Section"] : taskData.phase === "expand" ? ["Expand Introduction", "Expand Body", "Expand Conclusion", "Add Details"] : taskData.phase === "review" ? ["Review Structure", "Review Content", "Review Style", "Make Changes"] : ["Generate Draft", "Download Outline", "Edit Draft", "Final Review"]).map((option, index) => (
                              <Button
                                key={index}
                                size="sm"
                                px={4}
                                py={2}
                                color="whiteAlpha.900"
                                bg="rgba(255, 255, 255, 0.03)"
                                backdropFilter="blur(8px)"
                                border="1px solid"
                                borderColor="whiteAlpha.100"
                                _hover={{
                                  bg: "rgba(255, 255, 255, 0.08)",
                                  borderColor: chat.color,
                                  transform: "translateY(-1px)",
                                  boxShadow: `0 4px 12px ${chat.color}22`,
                                }}
                                _active={{
                                  transform: "translateY(0)",
                                }}
                                transition="all 0.2s"
                                whiteSpace="nowrap"
                              >
                                {option}
                              </Button>
                            ))}
                          </HStack>

                          {/* Input Area */}
                          <Box w="100%">
                            <form onSubmit={handleAgentSubmit}>
                              <VStack spacing={4} w="100%">
                                <Input
                                  value={agentMessageText}
                                  onChange={(e) => setAgentMessageText(e.target.value)}
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
                                <Button
                                  w="100%"
                                  size="lg"
                                  bg={`${chat.color}22`}
                                  color="white"
                                  _hover={{
                                    bg: `${chat.color}33`,
                                    transform: "translateY(-2px)",
                                  }}
                                  _active={{
                                    transform: "translateY(0)",
                                  }}
                                  transition="all 0.2s"
                                  type="submit"
                                  isDisabled={!agentMessageText.trim()}
                                  leftIcon={<FaArrowUp />}
                                >
                                  Send Message
                                </Button>
                              </VStack>
                            </form>
                          </Box>
                        </>
                      )}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
        </VStack>
      </Flex>

      {/* Scroll to bottom button */}
      {userScrolled && (
        <Box position="fixed" bottom="100px" left="25%" transform="translateX(-50%)" zIndex={2}>
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
