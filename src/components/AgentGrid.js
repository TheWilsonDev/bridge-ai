import React, { useState } from "react";
import { SimpleGrid, Box, VStack, Text, Icon, Grid, Flex, Input, InputGroup, InputLeftElement, InputRightElement, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Button, Divider, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FaRobot, FaCode, FaChartLine, FaPencilAlt, FaArrowUp, FaCheck, FaStar } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "code",
    name: "Code Assistant",
    description: "Programming and development tutors",
    icon: FaCode,
    color: "#4299E1",
    agents: [
      {
        name: "Full-Stack Web Developer",
        description: "Master modern web development with React, Node.js, and cloud services",
      },
      {
        name: "AI/ML Engineer",
        description: "Build intelligent systems with PyTorch, TensorFlow, and deep learning",
      },
      {
        name: "DevOps Specialist",
        description: "Learn CI/CD, Docker, Kubernetes, and cloud infrastructure automation",
      },
      {
        name: "Mobile App Developer",
        description: "Create cross-platform apps with React Native and Flutter",
      },
      {
        name: "Backend Architecture Expert",
        description: "Design scalable systems, microservices, and API architectures",
      },
      {
        name: "Frontend UI/UX Developer",
        description: "Build responsive interfaces with modern frameworks and design systems",
      },
      {
        name: "Cloud Solutions Architect",
        description: "Master AWS, Azure, or GCP cloud services and serverless architecture",
      },
      {
        name: "Blockchain Developer",
        description: "Create smart contracts and decentralized applications (dApps)",
      },
      {
        name: "Security Engineer",
        description: "Implement cybersecurity best practices and penetration testing",
      },
      {
        name: "Data Engineer",
        description: "Build data pipelines and ETL processes with modern tools",
      },
    ],
  },
  {
    id: "data",
    name: "Data Analyst",
    description: "Data analysis and visualization tutors",
    icon: FaChartLine,
    color: "#48BB78",
    agents: [
      {
        name: "Business Intelligence Expert",
        description: "Master Power BI, Tableau, and data-driven decision making",
      },
      {
        name: "Data Science Specialist",
        description: "Advanced analytics with Python, R, and statistical modeling",
      },
      {
        name: "Big Data Engineer",
        description: "Handle large-scale data processing with Spark and Hadoop",
      },
      {
        name: "Marketing Analytics Pro",
        description: "Track and optimize marketing campaigns with data-driven insights",
      },
      {
        name: "Financial Data Analyst",
        description: "Analyze market trends and financial forecasting",
      },
      {
        name: "Healthcare Data Specialist",
        description: "Process and analyze medical data and health records",
      },
    ],
  },
  {
    id: "content",
    name: "Content Writer",
    description: "Writing and content creation tutors",
    icon: FaPencilAlt,
    color: "#ED8936",
    agents: [
      {
        name: "Essay Writer Pro",
        description: "Craft academic essays & papers with professional quality and originality",
        specialTag: "Undetectable",
        verifiedTag: "Bridge Verified",
        detailedDescription: "Our Essay Writer Pro is designed to help you create outstanding academic papers that maintain the highest standards of originality. Using advanced writing techniques and deep subject understanding, it ensures your essays are both compelling and unique.",
        features: ["Sophisticated writing style adaptation", "In-depth research capabilities", "Perfect citation and formatting", "Multiple academic styles (APA, MLA, Chicago)", "Plagiarism-free guarantee", "24/7 writing assistance"],
        benefits: ["Save time while maintaining quality", "Learn proper essay structure", "Improve your writing skills", "Meet tight deadlines confidently"],
      },
      {
        name: "Technical Documentation Expert",
        description: "Create clear API docs, user guides, and system documentation",
      },
      {
        name: "AI Content Strategist",
        description: "Optimize content for AI and search algorithms",
      },
      {
        name: "UX Writer",
        description: "Craft user-friendly interface copy and microcopy",
      },
      {
        name: "Developer Advocate",
        description: "Create tutorials, blogs, and developer education content",
      },
      {
        name: "API Documentation Specialist",
        description: "Write comprehensive API documentation and references",
      },
    ],
  },
  {
    id: "general",
    name: "General Assistant",
    description: "Various specialized tutors",
    icon: FaRobot,
    color: "#9F7AEA",
    agents: [
      {
        name: "Agile Project Coach",
        description: "Guide teams in Scrum, Kanban, and agile methodologies",
      },
      {
        name: "Code Review Mentor",
        description: "Learn best practices for code review and team collaboration",
      },
      {
        name: "System Design Coach",
        description: "Master software architecture and system design patterns",
      },
      {
        name: "Tech Interview Prep",
        description: "Prepare for technical interviews at top companies",
      },
      {
        name: "Open Source Contributor",
        description: "Learn to contribute to open source projects effectively",
      },
    ],
  },
];

const AgentCard = ({ name, description, icon, color, isSelected, onClick }) => {
  return (
    <Box
      bg="#1A202C"
      p={6}
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.2s"
      borderColor={isSelected ? color : "transparent"}
      borderWidth="2px"
      onClick={onClick}
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
    >
      <VStack spacing={4} align="center">
        <Icon as={icon} w={10} h={10} color={color} />
        <Text color="white" fontSize="xl" fontWeight="bold">
          {name}
        </Text>
        <Text color="gray.300" textAlign="center">
          {description}
        </Text>
      </VStack>
    </Box>
  );
};

const TutorModal = ({ isOpen, onClose, tutor, color, categoryName }) => {
  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate("/dashboard/chat", {
      state: {
        agent: tutor,
        category: categoryName,
        color: color,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg="#1A202C" border="1px solid" borderColor={color + "44"}>
        <ModalHeader>
          <Flex justify="space-between" align="center" gap={4} pr={8}>
            <Text color="white" fontSize="2xl">
              {tutor.name}
            </Text>
            <Flex gap={2} flex="0 0 auto">
              {tutor.verifiedTag && (
                <Box bg="cyan.900" color="cyan.200" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor="cyan.700" textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={1} whiteSpace="nowrap">
                  <Box as="span" w={2} h={2} borderRadius="full" bg="cyan.400" />
                  {tutor.verifiedTag}
                </Box>
              )}
              {tutor.specialTag && (
                <Box bg={`${color}22`} color={color} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor={`${color}44`} textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={1} whiteSpace="nowrap">
                  <Box as="span" w={2} h={2} borderRadius="full" bg={color} />
                  {tutor.specialTag}
                </Box>
              )}
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody pb={6}>
          <VStack align="stretch" spacing={4}>
            <Text color="gray.300" fontSize="md">
              {tutor.description}
            </Text>

            {tutor.detailedDescription && (
              <>
                <Divider borderColor="whiteAlpha.200" />
                <Text color="white" fontSize="md">
                  {tutor.detailedDescription}
                </Text>
              </>
            )}

            {tutor.features && (
              <>
                <Text color="white" fontSize="lg" fontWeight="semibold" mt={2}>
                  Key Features
                </Text>
                <List spacing={2}>
                  {tutor.features.map((feature, index) => (
                    <ListItem key={index} color="gray.300" display="flex" alignItems="center">
                      <ListIcon as={FaCheck} color={color} />
                      {feature}
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {tutor.benefits && (
              <>
                <Text color="white" fontSize="lg" fontWeight="semibold" mt={2}>
                  Benefits
                </Text>
                <List spacing={2}>
                  {tutor.benefits.map((benefit, index) => (
                    <ListItem key={index} color="gray.300" display="flex" alignItems="center">
                      <ListIcon as={FaStar} color={color} />
                      {benefit}
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Box mt={4}>
              <Button
                width="full"
                bg={color}
                color="white"
                onClick={handleStartSession}
                _hover={{
                  bg: color,
                  opacity: 0.9,
                }}
                _active={{
                  bg: color,
                  opacity: 0.8,
                }}
              >
                Start Session
              </Button>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const SubAgentCard = ({ name, description, color, specialTag, verifiedTag, categoryName, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        bg="#1A202C"
        p={4}
        borderRadius="md"
        transition="all 0.2s"
        userSelect="none"
        borderWidth="1px"
        borderColor="transparent"
        cursor="pointer"
        onClick={onOpen}
        _hover={{
          transform: "translateX(4px)",
          boxShadow: "md",
          borderColor: color,
        }}
      >
        <VStack align="start" spacing={2}>
          <Flex align="center" width="100%" justify="space-between" gap={2}>
            <Text color="white" fontSize="lg" fontWeight="semibold">
              {name}
            </Text>
            <Flex gap={2}>
              {verifiedTag && (
                <Box bg="cyan.900" color="cyan.200" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor="cyan.700" textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={1}>
                  <Box as="span" w={2} h={2} borderRadius="full" bg="cyan.400" />
                  {verifiedTag}
                </Box>
              )}
              {specialTag && (
                <Box bg={`${color}22`} color={color} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor={`${color}44`} textTransform="uppercase" letterSpacing="wider" display="flex" alignItems="center" gap={1}>
                  <Box as="span" w={2} h={2} borderRadius="full" bg={color} />
                  {specialTag}
                </Box>
              )}
            </Flex>
          </Flex>
          <Text color="gray.300" fontSize="sm">
            {description}
          </Text>
        </VStack>
      </Box>
      <TutorModal isOpen={isOpen} onClose={onClose} tutor={{ name, description, specialTag, verifiedTag, ...rest }} color={color} categoryName={categoryName} />
    </>
  );
};

const AgentGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState("code");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);

  const selectedCategoryData = categories.find((c) => c.id === selectedCategory);

  // Function to calculate similarity between two strings
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    // Handle exact matches and substrings
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Split into words for partial matches
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    // Check for word matches
    const commonWords = words1.filter((word) => words2.some((w2) => w2.includes(word) || word.includes(w2)));

    if (commonWords.length > 0) {
      return 0.6 * (commonWords.length / Math.max(words1.length, words2.length));
    }

    // Character-level similarity for typos
    let matches = 0;
    const maxLength = Math.max(s1.length, s2.length);
    const minLength = Math.min(s1.length, s2.length);

    for (let i = 0; i < minLength; i++) {
      if (s1[i] === s2[i]) matches++;
    }

    return matches / maxLength;
  };

  const handleSearch = () => {
    if (!selectedCategoryData) return;

    const query = searchQuery.trim();
    if (!query) {
      setFilteredAgents(selectedCategoryData.agents);
      return;
    }

    // Search with similarity scoring
    const searchResults = selectedCategoryData.agents.filter((agent) => {
      const nameScore = calculateSimilarity(agent.name, query);
      const descScore = calculateSimilarity(agent.description, query);

      // Define related terms for common searches
      const relatedTerms = {
        frontend: ["front end", "front-end", "ui", "interface"],
        backend: ["back end", "back-end", "server", "api"],
        fullstack: ["full stack", "full-stack", "frontend backend"],
        ml: ["machine learning", "ai", "artificial intelligence"],
        ui: ["user interface", "frontend", "design"],
        ux: ["user experience", "design", "interface"],
        devops: ["deployment", "operations", "ci/cd"],
        api: ["backend", "endpoints", "services"],
      };

      // Check related terms
      const queryLower = query.toLowerCase();
      for (const [key, terms] of Object.entries(relatedTerms)) {
        if (terms.some((term) => calculateSimilarity(term, queryLower) > 0.7) && (agent.name.toLowerCase().includes(key) || agent.description.toLowerCase().includes(key))) {
          return true;
        }
      }

      // Return true if either name or description has a high enough similarity score
      return nameScore > 0.3 || descScore > 0.3;
    });

    setFilteredAgents(searchResults);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    // Auto-requery when input becomes empty
    if (!newValue.trim()) {
      setFilteredAgents(selectedCategoryData?.agents || []);
    }
  };

  // Initialize filtered agents when category changes
  React.useEffect(() => {
    setFilteredAgents(selectedCategoryData?.agents || []);
  }, [selectedCategory, selectedCategoryData]);

  return (
    <VStack spacing={4} align="stretch" w="full" height="100%">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
        {categories.map((category) => (
          <AgentCard key={category.id} {...category} isSelected={selectedCategory === category.id} onClick={() => setSelectedCategory(category.id)} />
        ))}
      </SimpleGrid>

      <Box p={6} bg="#1A202C" borderRadius="lg" borderColor={selectedCategoryData?.color} borderWidth="1px" flex="1" display="flex" flexDirection="column" overflow="hidden">
        <Flex justify="space-between" align="center" mb={4} position="relative">
          <Text color="white" fontSize="xl" fontWeight="bold" minW="200px">
            {selectedCategoryData?.name.replace(" Assistant", "")} Tutor Agents
          </Text>
          <Box position="absolute" left="50%" transform="translateX(-50%)" display="flex" alignItems="center" width="600px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={AiOutlineSearch} color="whiteAlpha.800" />
              </InputLeftElement>
              <Input
                placeholder="Search agents..."
                size="md"
                bg="#141821"
                border="1px solid"
                borderColor="whiteAlpha.500"
                _placeholder={{ color: "whiteAlpha.700" }}
                _hover={{
                  borderColor: "whiteAlpha.700",
                  bg: "#161a25",
                }}
                _focus={{
                  borderColor: selectedCategoryData?.color,
                  boxShadow: `0 0 0 1px ${selectedCategoryData?.color}`,
                  bg: "#161a25",
                }}
                color="white"
                pr="48px"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              <InputRightElement width="40px" right="4px">
                <IconButton
                  icon={<FaArrowUp />}
                  size="sm"
                  variant="ghost"
                  color="whiteAlpha.800"
                  bg="#141821"
                  borderLeft="1px"
                  borderColor="whiteAlpha.500"
                  borderRadius="0"
                  height="34px"
                  width="40px"
                  onClick={handleSearch}
                  _hover={{
                    bg: "#161a25",
                    color: selectedCategoryData?.color,
                  }}
                  _active={{
                    bg: "#161a25",
                    color: selectedCategoryData?.color,
                  }}
                />
              </InputRightElement>
            </InputGroup>
          </Box>
          <Box minW="200px" />
        </Flex>
        <Box
          flex="1"
          overflowY="auto"
          pr={2}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
              borderRadius: "8px",
              backgroundColor: "#2D3748",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: selectedCategoryData?.color,
              borderRadius: "8px",
            },
          }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} px={1}>
            {filteredAgents.map((agent, index) => (
              <SubAgentCard key={index} {...agent} color={selectedCategoryData?.color} categoryName={selectedCategoryData?.name} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </VStack>
  );
};

export default AgentGrid;
