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
      {
        name: "Senior Full-Stack Developer",
        description: "Advanced web development with React, Node.js, and cloud services",
      },
      {
        name: "Senior AI/ML Engineer",
        description: "Advanced AI systems with PyTorch, TensorFlow, and deep learning",
      },
      {
        name: "Senior DevOps Engineer",
        description: "Advanced CI/CD, Docker, Kubernetes, and infrastructure automation",
      },
      {
        name: "Senior Mobile Developer",
        description: "Advanced cross-platform apps with React Native and Flutter",
      },
      {
        name: "Senior Backend Architect",
        description: "Advanced scalable systems, microservices, and API architectures",
      },
      {
        name: "Senior Frontend Developer",
        description: "Advanced responsive interfaces with modern frameworks",
      },
      {
        name: "Senior Cloud Architect",
        description: "Advanced AWS, Azure, or GCP cloud services and serverless",
      },
      {
        name: "Senior Blockchain Engineer",
        description: "Advanced smart contracts and decentralized applications",
      },
      {
        name: "Senior Security Engineer",
        description: "Advanced cybersecurity practices and penetration testing",
      },
      {
        name: "Senior Data Engineer",
        description: "Advanced data pipelines and ETL processes",
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
      {
        name: "Lead Business Intelligence Expert",
        description: "Enterprise Power BI, Tableau, and data-driven strategies",
      },
      {
        name: "Lead Data Science Specialist",
        description: "Enterprise analytics with Python, R, and advanced modeling",
      },
      {
        name: "Lead Big Data Engineer",
        description: "Enterprise-scale data processing with Spark and Hadoop",
      },
      {
        name: "Lead Marketing Analytics Pro",
        description: "Enterprise marketing campaigns with advanced insights",
      },
      {
        name: "Lead Financial Analyst",
        description: "Enterprise market trends and financial forecasting",
      },
      {
        name: "Lead Healthcare Data Specialist",
        description: "Enterprise medical data and health records analysis",
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
      {
        name: "Master Essay Writer Pro",
        description: "Expert academic essays & papers with unmatched quality",
        specialTag: "Premium",
        verifiedTag: "Bridge Verified",
        detailedDescription: "Our Master Essay Writer Pro offers the highest level of academic writing expertise. Using advanced techniques and comprehensive subject knowledge, it delivers exceptional papers that exceed expectations.",
        features: ["Advanced writing style customization", "Comprehensive research methodology", "Expert citation handling", "All academic styles supported", "Premium quality guarantee", "Priority assistance"],
        benefits: ["Premium quality assurance", "Advanced writing techniques", "Expert skill development", "Priority deadline handling"],
      },
      {
        name: "Master Technical Writer",
        description: "Expert technical documentation and system guides",
      },
      {
        name: "Master Content Strategist",
        description: "Expert content optimization for AI and search",
      },
      {
        name: "Master UX Writer",
        description: "Expert interface copy and user experience writing",
      },
      {
        name: "Master Developer Advocate",
        description: "Expert technical content and developer relations",
      },
      {
        name: "Master API Documentation Expert",
        description: "Expert API documentation and technical writing",
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
      {
        name: "Expert Agile Coach",
        description: "Advanced Scrum, Kanban, and agile transformation",
      },
      {
        name: "Expert Code Reviewer",
        description: "Advanced code review and team collaboration practices",
      },
      {
        name: "Expert System Designer",
        description: "Advanced software architecture and design patterns",
      },
      {
        name: "Expert Interview Coach",
        description: "Advanced technical interview preparation",
      },
      {
        name: "Expert OSS Contributor",
        description: "Advanced open source contribution strategies",
      },
    ],
  },
];

const AgentCard = ({ name, description, icon, color, isSelected, onClick }) => {
  // Function to create a very subtle tint
  const getTintBg = (color, selected) => {
    const tintOpacity = selected ? "18" : "08";
    return `linear-gradient(rgba(26, 32, 44, 0.6), rgba(26, 32, 44, 0.6)), ${color}${tintOpacity}`;
  };

  // Function to create a slightly stronger tint for hover
  const getHoverTintBg = (color, selected) => {
    const tintOpacity = selected ? "22" : "11";
    return `linear-gradient(rgba(26, 32, 44, 0.6), rgba(26, 32, 44, 0.6)), ${color}${tintOpacity}`;
  };

  return (
    <Box
      bg={getTintBg(color, isSelected)}
      backdropFilter="blur(10px)"
      p={6}
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.3s"
      position="relative"
      overflow="hidden"
      onClick={onClick}
      boxShadow={`0 0 0 0 ${color}00`}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "lg",
        padding: "2px",
        background: isSelected ? `linear-gradient(45deg, ${color}66, ${color}aa, ${color}66)` : "linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.3), rgba(255,255,255,0.15))",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: 0,
        left: "-50%",
        width: "50%",
        height: "100%",
        background: "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)",
        transform: "skewX(-25deg)",
        transition: "0.5s",
      }}
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: `0 0 30px -5px ${color}66`,
        bg: getHoverTintBg(color, isSelected),
        _after: {
          left: "150%",
        },
        _before: {
          background: isSelected ? `linear-gradient(45deg, ${color}88, ${color}cc, ${color}88)` : `linear-gradient(45deg, rgba(255,255,255,0.2), ${color}44, rgba(255,255,255,0.2))`,
        },
        "& svg": {
          transform: "scale(1.1) rotate(5deg)",
        },
      }}
    >
      <VStack spacing={4} align="center" position="relative">
        <Icon as={icon} w={10} h={10} color={color} transition="transform 0.3s" filter={`drop-shadow(0 0 8px ${color}44)`} />
        <Text color="white" fontSize="xl" fontWeight="bold" textShadow={`0 0 20px ${color}33`}>
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
        bg="rgba(26, 32, 44, 0.4)"
        backdropFilter="blur(8px)"
        p={4}
        borderRadius="md"
        transition="all 0.2s"
        cursor="pointer"
        onClick={onOpen}
        position="relative"
        overflow="hidden"
        zIndex={1}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "md",
          padding: "1px",
          background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "50%",
          height: "100%",
          background: "linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)",
          transform: "skewX(-25deg)",
          transition: "0.5s",
        }}
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px -6px rgba(0, 0, 0, 0.3)",
          zIndex: 2,
          _after: {
            left: "150%",
          },
          _before: {
            background: "linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.25), rgba(255,255,255,0.15))",
          },
        }}
      >
        <VStack align="start" spacing={2} position="relative">
          <Flex align="center" width="100%" justify="space-between" gap={2}>
            <Text color="white" fontSize="lg" fontWeight="semibold">
              {name}
            </Text>
            <Flex gap={2}>
              {verifiedTag && (
                <Box bg="rgba(6, 126, 129, 0.2)" color="cyan.200" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor="cyan.700" backdropFilter="blur(4px)">
                  <Box as="span" w={2} h={2} borderRadius="full" bg="cyan.400" display="inline-block" mr={1} />
                  {verifiedTag}
                </Box>
              )}
              {specialTag && (
                <Box bg={`${color}11`} color={color} px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold" border="1px solid" borderColor={`${color}44`} backdropFilter="blur(4px)">
                  <Box as="span" w={2} h={2} borderRadius="full" bg={color} display="inline-block" mr={1} />
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

      <Box
        p={6}
        bg={selectedCategoryData?.color === "#4299E1" ? "rgba(26, 32, 44, 0.4)" : `linear-gradient(rgba(26, 32, 44, 0.4), rgba(26, 32, 44, 0.4)), ${selectedCategoryData?.color}05`}
        backdropFilter="blur(12px)"
        borderRadius="2xl"
        flex="1"
        display="flex"
        flexDirection="column"
        position="relative"
        maxH="calc(100vh - 280px)"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "2xl",
          padding: "2px",
          background: `linear-gradient(45deg, ${selectedCategoryData?.color}44, ${selectedCategoryData?.color}88, ${selectedCategoryData?.color}44)`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        <Box position="absolute" top={0} left={0} right={0} zIndex={3}>
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="100%"
            borderTopRadius="2xl"
            bg={`linear-gradient(90deg, 
              rgba(26, 32, 44, 0.5),
              ${selectedCategoryData?.color}15 0%,
              ${selectedCategoryData?.color}15 10%,
              rgba(26, 32, 44, 0.6) 15%, 
              rgba(26, 32, 44, 0.6) 25%, 
              ${selectedCategoryData?.color}20 50%,
              rgba(26, 32, 44, 0.6) 75%,
              rgba(26, 32, 44, 0.5)
            )`}
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              borderTopRadius: "2xl",
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${selectedCategoryData?.color}44 15%, 
                ${selectedCategoryData?.color}88 50%, 
                ${selectedCategoryData?.color}44 85%, 
                transparent 100%
              )`,
            }}
            _after={{
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${selectedCategoryData?.color}22 20%, 
                ${selectedCategoryData?.color}44 50%, 
                ${selectedCategoryData?.color}22 80%, 
                transparent 100%
              )`,
            }}
          />
          <Flex
            justify="space-between"
            align="center"
            position="relative"
            px={6}
            py={4}
            _before={{
              content: '""',
              position: "absolute",
              left: "2px",
              top: "10%",
              bottom: "10%",
              width: "1px",
              background: `linear-gradient(180deg, 
                transparent 0%, 
                ${selectedCategoryData?.color}44 30%, 
                ${selectedCategoryData?.color}44 70%, 
                transparent 100%
              )`,
            }}
            _after={{
              content: '""',
              position: "absolute",
              right: "2px",
              top: "10%",
              bottom: "10%",
              width: "1px",
              background: `linear-gradient(180deg, 
                transparent 0%, 
                ${selectedCategoryData?.color}44 30%, 
                ${selectedCategoryData?.color}44 70%, 
                transparent 100%
              )`,
            }}
          >
            <Text color="white" fontSize="xl" fontWeight="bold" minW="200px" zIndex={1} textShadow={`0 0 20px ${selectedCategoryData?.color}33`}>
              {selectedCategoryData?.name.replace(" Assistant", "")} Tutor Agents
            </Text>
            <Box position="absolute" left="50%" transform="translateX(-50%)" display="flex" alignItems="center" width="600px" zIndex={1}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={AiOutlineSearch} color="whiteAlpha.800" />
                </InputLeftElement>
                <Input
                  placeholder="Search agents..."
                  size="md"
                  bg="rgba(20, 24, 33, 0.6)"
                  backdropFilter="blur(8px)"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  _placeholder={{ color: "whiteAlpha.500" }}
                  _hover={{
                    borderColor: "whiteAlpha.400",
                    bg: "rgba(22, 26, 37, 0.6)",
                  }}
                  _focus={{
                    borderColor: `${selectedCategoryData?.color}66`,
                    boxShadow: "none",
                    bg: "rgba(22, 26, 37, 0.8)",
                    _before: {
                      opacity: 1,
                    },
                  }}
                  color="white"
                  pr="48px"
                  position="relative"
                  transition="all 0.2s"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "md",
                    padding: "1px",
                    background: `linear-gradient(45deg, ${selectedCategoryData?.color}44, ${selectedCategoryData?.color}88, ${selectedCategoryData?.color}44)`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                />
                <InputRightElement width="40px" right="4px">
                  <IconButton
                    icon={<FaArrowUp />}
                    size="sm"
                    variant="ghost"
                    color="whiteAlpha.600"
                    bg="transparent"
                    borderLeft="1px"
                    borderColor="whiteAlpha.200"
                    borderRadius="0"
                    height="34px"
                    width="40px"
                    transition="all 0.2s"
                    _hover={{
                      bg: "rgba(22, 26, 37, 0.8)",
                      color: selectedCategoryData?.color,
                      borderColor: "whiteAlpha.300",
                    }}
                    _active={{
                      bg: "rgba(22, 26, 37, 0.9)",
                      color: selectedCategoryData?.color,
                      transform: "translateY(1px)",
                    }}
                    onClick={handleSearch}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
            <Box minW="200px" />
          </Flex>
        </Box>

        <Box
          position="absolute"
          top="65px"
          left={0}
          right={0}
          bottom={0}
          overflowY="auto"
          overflowX="hidden"
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
              borderRadius: "8px",
              backgroundColor: "rgba(45, 55, 72, 0.3)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: selectedCategoryData?.color,
              borderRadius: "8px",
            },
          }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} position="relative" px={8} pb={6} pt={4}>
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
